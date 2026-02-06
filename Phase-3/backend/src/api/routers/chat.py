from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
from sqlmodel import Session, select

from ...services.chat_service import ChatService, ChatRequest, ChatResponse
from ...core.config import settings
from ...models.conversation import Conversation
from ...models.database import get_session

router = APIRouter()


@router.post("/chat")
async def chat_endpoint(chat_request: ChatRequest) -> Dict[str, Any]:
    """
    Chat endpoint that processes user messages using AI with function calling.

    This endpoint:
    1. Fetches conversation history from database
    2. Sends the history + new message to Gemini
    3. Gemini decides which MCP tools to call
    4. Executes tools and gets results
    5. Stores conversation in database
    6. Returns response
    """
    print(f"Chat endpoint called with request: {chat_request}")
    try:
        # Initialize the chat service with the API key
        chat_service = ChatService(api_key=settings.GROQ_API_KEY)

        # Process the request
        response = chat_service.process_request(chat_request)
        print(f"Chat service response: {response}")

        if response.success:
            result = {
                "response": response.response,
                "success": True
            }
            print(f"Returning success response: {result}")
            return result
        else:
            print(f"Returning error response: {response.error}")
            raise HTTPException(status_code=500, detail=response.error)

    except HTTPException as he:
        # Re-raise HTTP exceptions
        print(f"HTTP exception: {he.detail}")
        raise
    except Exception as e:
        print(f"General exception in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/history")
async def get_chat_history(user_id: str, session: Session = Depends(get_session)) -> List[Conversation]:
    """
    Get chat history for a specific user.
    """
    try:
        print(f"Fetching chat history for user: {user_id}")
        
        # Get conversation history for the user, ordered by creation time
        statement = select(Conversation).where(Conversation.user_id == user_id).order_by(Conversation.created_at.asc())
        results = session.exec(statement)
        conversations = results.all()
        
        print(f"Found {len(conversations)} messages for user {user_id}")
        return conversations
    except Exception as e:
        print(f"Error fetching chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching chat history: {str(e)}")