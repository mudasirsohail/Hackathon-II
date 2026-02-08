---
id: 8
title: Rebuild-Gemini-integration-with-simple-working-approach
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement The chatbot is completely broken. I need you to rebuild the Gemini integration from scratch using a SIMPLE, WORKING approach.
labels: ["refactor", "api", "gemini", "simple-implementation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:\Hackathon II\Phase-3\backend\src\services\chat_service.py
tests:
 - D:\Hackathon II\Phase-3\backend\test_chat.py
 - D:\Hackathon II\Phase-3\backend\test_connection.py
---

## Prompt

The chatbot is completely broken. I need you to rebuild the Gemini integration from scratch using a SIMPLE, WORKING approach.

WHAT I WANT:
When I type "Add task buy groceries" in the chat, it should:
1. Understand I want to add a task
2. Create the task in the database with my user_id (already provided in the request)
3. Reply "Task 'buy groceries' added successfully!"

Same for: "show my tasks", "complete task 5", "delete task 3", "update task 2 to buy milk"

CURRENT PROBLEMS:
1. google.genai library errors - wrong API usage
2. user_id not being passed to MCP tools
3. Function calling is broken

FIX IT LIKE THIS:

STEP 1 - Use the OLD google-generativeai library (it works):
pip install google-generativeai==0.8.3

import google.generativeai as genai
genai.configure(api_key=GEMINI_API_KEY)

STEP 2 - Simple function calling WITHOUT MCP complexity:
When user says "add task X":
- Extract task title from message using simple string parsing OR basic Gemini prompt
- Call: result = await add_task_to_db(user_id=request.user_id, title=extracted_title)
- Return: "Task added successfully!"

Skip the complex MCP server, function declarations, and all that. Just:
1. Use Gemini to understand the user's intent (add/list/complete/delete/update)
2. Extract the task details from the message
3. Call the database function DIRECTLY with user_id from the request
4. Return a friendly response

STEP 3 - Database functions (already exist, just call them):
- add_task_to_db(user_id, title, description) 
- list_tasks_from_db(user_id, status)
- complete_task_in_db(user_id, task_id)
- delete_task_from_db(user_id, task_id)
- update_task_in_db(user_id, task_id, title, description)

STEP 4 - Simple Gemini prompt:
"You are a task manager. Extract the intent and details from user messages.
User ID: {user_id}
Examples:
- 'add task buy milk' → intent: add, title: 'buy milk'
- 'show tasks' → intent: list
- 'complete task 5' → intent: complete, task_id: 5

Respond with JSON: {\"intent\": \"add\", \"title\": \"buy milk\"}"

Make it SIMPLE and WORKING. No complex MCP, no function calling complications. Just:
1. Gemini understands intent → 2. Call database → 3. Return response

MAKE IT WORK IN THE NEXT ATTEMPT.

## Response snapshot

I have successfully rebuilt the Gemini integration from scratch with a simple, working approach that addresses all the issues:

### Problem
The previous implementation was overly complex with:
- Wrong library usage (google-genai)
- Broken function calling with MCP tools
- Missing user_id in database operations
- Complicated code that wasn't working

### Solution
I rebuilt the chat service with a simple, direct approach:

1. **Used the working library**: Installed `google-generativeai==0.8.3` which works reliably
2. **Simple intent parsing**: Combined basic string matching with Gemini for complex cases
3. **Direct database operations**: Called database functions directly with user_id from the request
4. **Removed complexity**: Eliminated MCP tools, function declarations, and complex function calling

### Key Features Implemented
- **Add task**: When user says "Add task buy groceries", extracts the title and creates a task in the database
- **List tasks**: When user says "Show my tasks", retrieves and displays all user's tasks
- **Complete task**: When user says "Complete task 5", marks the specified task as completed
- **Delete task**: When user says "Delete task 3", removes the specified task
- **Update task**: When user says "Update task 2 to buy milk", updates the specified task

### Files Modified
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Complete rewrite with simple implementation

### Approach
1. **Intent Recognition**: Used simple pattern matching for common commands, with Gemini as fallback for complex cases
2. **Direct Database Calls**: Called TaskService methods directly with user_id from the request
3. **Simple JSON Response**: Used basic JSON parsing to extract intent data from Gemini when needed
4. **Error Handling**: Added proper error handling for all operations

### Testing
- Both existing tests (`test_chat.py` and `test_connection.py`) pass successfully
- The implementation handles all the requested functionality:
  - "Add task buy groceries" → Creates task and responds "Task 'buy groceries' added successfully!"
  - "Show my tasks" → Lists all user's tasks
  - "Complete task 5" → Marks task 5 as completed
  - "Delete task 3" → Removes task 3
  - "Update task 2 to buy milk" → Updates task 2 with new title

The new implementation is simple, reliable, and handles all the required functionality without the complexity that was causing issues in the previous version.

## Outcome

- ✅ Impact: Rebuilt chatbot with simple, working approach that handles all required functionality
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Completely rewrote chat_service.py with simple implementation
- 🔁 Next prompts: None needed - issues are resolved
- 🧠 Reflection: Simpler approach eliminated complexity that was causing issues

## Evaluation notes (flywheel)

- Failure modes observed: Overly complex implementation with broken function calling
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A