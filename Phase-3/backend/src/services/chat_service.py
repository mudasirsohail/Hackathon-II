from groq import Groq
import json
import re
from typing import List, Dict, Any
from pydantic import BaseModel
from sqlmodel import Session, select
from ..models.conversation import Conversation, ConversationCreate
from ..models.database import get_session
from ..services.task_service import TaskService
from ..models.task import TaskCreate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ChatRequest(BaseModel):
    message: str
    user_id: str


class ChatResponse(BaseModel):
    response: str
    success: bool
    error: str = None


class ChatService:
    """Service class for handling chat interactions with AI using Groq."""

    def __init__(self, api_key: str):
        # Validate API key before configuring
        if not api_key or len(api_key.strip()) == 0:
            raise ValueError("GROQ_API_KEY is not set or is empty")

        # Initialize the Groq client
        self.client = Groq(api_key=api_key)
        print("ChatService initialized with Groq client")

    def get_conversation_history(self, user_id: str, session: Session) -> List[Dict[str, str]]:
        """Retrieve conversation history for a user."""
        from sqlalchemy import desc
        from ..models.conversation import Conversation

        # Get the last 10 messages for context
        statement = select(Conversation).where(Conversation.user_id == user_id).order_by(desc(Conversation.created_at)).limit(10)
        results = session.exec(statement)
        conversation_records = results.all()

        # Reverse to get chronological order
        history = []
        for record in reversed(conversation_records):
            history.append({
                "role": "user" if record.role == "user" else "assistant",
                "content": record.content
            })

        return history

    def store_message(self, user_id: str, role: str, content: str, session: Session):
        """Store a message in the conversation history."""
        conversation = ConversationCreate(
            user_id=user_id,
            role=role,
            content=content
        )

        db_conversation = Conversation(**conversation.model_dump())
        session.add(db_conversation)
        session.commit()

    def process_request(self, chat_request: ChatRequest) -> ChatResponse:
        """Process a chat request and return a response."""
        try:
            # Get conversation history
            for session in get_session():
                history = self.get_conversation_history(chat_request.user_id, session)

                # Store the user's message
                self.store_message(chat_request.user_id, "user", chat_request.message, session)

                # Parse the user's intent using Groq
                intent_data = self.parse_intent(chat_request.message, chat_request.user_id)
                
                # Execute the appropriate action based on intent
                response_text = self.execute_intent(intent_data, chat_request.user_id, session)

                # Store the AI's response
                self.store_message(chat_request.user_id, "assistant", response_text, session)

                return ChatResponse(response=response_text, success=True)

        except Exception as e:
            return ChatResponse(response="", success=False, error=str(e))

    def parse_intent(self, message: str, user_id: str) -> Dict[str, Any]:
        """Parse the user's intent from the message using Groq."""
        try:
            # Create the system prompt with examples for intent recognition
            system_prompt = f"""
You are a task management assistant. Understand user intent from natural language.

USER ID: {user_id}

EXAMPLES:
ADD TASK: "Add task buy groceries" → {{"intent": "add", "task_title": "buy groceries"}}
ADD TASK: "Create task Eating" → {{"intent": "add", "task_title": "Eating"}}
ADD TASK: "Add task mobile hanging" → {{"intent": "add", "task_title": "mobile hanging"}}  
ADD TASK: "Create a task called fix the bug" → {{"intent": "add", "task_title": "fix the bug"}}
ADD TASK: "I need to remember to call mom" → {{"intent": "add", "task_title": "call mom"}}
ADD TASK: "New task: finish homework" → {{"intent": "add", "task_title": "finish homework"}}

LIST TASKS: "Show my tasks" → {{"intent": "list"}}
LIST TASKS: "List tasks" → {{"intent": "list"}}
LIST TASKS: "What are my tasks" → {{"intent": "list"}}
LIST TASKS: "Show me all tasks" → {{"intent": "list"}}

COMPLETE: "Complete task 5" → {{"intent": "complete", "task_id": 5}}
COMPLETE: "Mark 5 as done" → {{"intent": "complete", "task_id": 5}}
COMPLETE: "Finish task 5" → {{"intent": "complete", "task_id": 5}}

DELETE: "Delete task 3" → {{"intent": "delete", "task_id": 3}}
DELETE: "Remove task 3" → {{"intent": "delete", "task_id": 3}}
DELETE: "Cancel task 3" → {{"intent": "delete", "task_id": 3}}

UPDATE: "Update task 2 to buy milk" → {{"intent": "update", "task_id": 2, "task_title": "buy milk"}}
UPDATE: "Change task 2 to buy milk" → {{"intent": "update", "task_id": 2, "task_title": "buy milk"}}

RESPOND WITH ONLY JSON:
{{
  "intent": "add|list|complete|delete|update",
  "task_title": "extracted title",
  "task_id": number
}}

Be flexible with phrasing and extract the task title from anywhere in the message.
"""

            # Make the API call to Groq
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Message: {message}\n\nRespond with only JSON:"}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Extract the response content
            result = response.choices[0].message.content
            
            # Clean up the response to extract JSON
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                intent_data = json.loads(json_str)
                
                # Map task_title to title for consistency with the rest of the code
                if "task_title" in intent_data and "title" not in intent_data:
                    intent_data["title"] = intent_data.pop("task_title")
                
                return intent_data
            else:
                # If Groq didn't return valid JSON, return a default response
                return {"intent": "unknown", "original_message": message}
                
        except Exception as e:
            print(f"Error parsing intent with Groq: {str(e)}")
            return {"intent": "unknown", "original_message": message}

    def execute_intent(self, intent_data: Dict[str, Any], user_id: str, session: Session) -> str:
        """Execute the appropriate action based on the parsed intent."""
        intent = intent_data.get("intent", "unknown")

        if intent == "add":
            title = intent_data.get("title", "").strip()
            if not title:
                return "Please specify a task title. For example: 'Add task buy groceries'"
            
            try:
                # Create task directly with user_id
                from ..models.task import Task
                print(f"Attempting to add task to database...")
                print(f"Task details - Title: {title}, User ID: {user_id}")

                task = Task(user_id=user_id, title=title)
                session.add(task)
                session.commit()
                print(f"Task added successfully, committing to database...")
                session.refresh(task)
                print(f"Commit successful! Task ID: {task.id}")

                return f"Task '{task.title}' added successfully!"
            except Exception as e:
                print(f"Error adding task: {str(e)}")
                import traceback
                print(f"Full traceback: {traceback.format_exc()}")
                return f"Error adding task: {str(e)}"

        elif intent == "list":
            try:
                tasks = TaskService.get_tasks(session, user_id, None)  # Get all tasks
                if not tasks:
                    return "You have no tasks."

                task_list = []
                for task in tasks:
                    status = "✓" if task.completed else "○"
                    task_list.append(f"{status} [{task.id}] {task.title}")

                return "Your tasks:\n" + "\n".join(task_list)
            except Exception as e:
                return f"Error listing tasks: {str(e)}"

        elif intent == "complete":
            task_id = intent_data.get("task_id")
            if not task_id:
                return "Please specify a task ID to complete. For example: 'Complete task 5'"
            
            try:
                task = TaskService.complete_task(session, user_id, task_id)
                if task:
                    return f"Task '{task.title}' marked as completed!"
                else:
                    return f"Task with ID {task_id} not found."
            except Exception as e:
                return f"Error completing task: {str(e)}"

        elif intent == "delete":
            task_id = intent_data.get("task_id")
            if not task_id:
                return "Please specify a task ID to delete. For example: 'Delete task 3'"
            
            try:
                success = TaskService.delete_task(session, user_id, task_id)
                if success:
                    return f"Task with ID {task_id} deleted successfully!"
                else:
                    return f"Task with ID {task_id} not found."
            except Exception as e:
                return f"Error deleting task: {str(e)}"

        elif intent == "update":
            task_id = intent_data.get("task_id")
            new_title = intent_data.get("title", "").strip()
            if not task_id or not new_title:
                return "Please specify a task ID and new title. For example: 'Update task 2 to buy milk'"
            
            try:
                task_update = {"title": new_title}
                task = TaskService.update_task(session, user_id, task_id, task_update)
                if task:
                    return f"Task with ID {task_id} updated to '{task.title}'!"
                else:
                    return f"Task with ID {task_id} not found."
            except Exception as e:
                return f"Error updating task: {str(e)}"

        else:
            return f"I didn't understand that. Try commands like: 'Add task buy groceries', 'Show my tasks', 'Complete task 5', 'Delete task 3', or 'Update task 2 to buy milk'."