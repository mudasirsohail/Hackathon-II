---
id: 1
title: ai-chatbot-for-todos-using-mcp-architecture
stage: general
date_iso: 2026-02-05
surface: agent
model: Qwen
feature: none
branch: main
user: user
command: /sp.implement
labels: ["hackathon", "mcp", "ai", "todo", "backend"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - D:\Hackathon II\Phase-3\backend\pyproject.toml
  - D:\Hackathon II\Phase-3\backend\requirements.txt
  - D:\Hackathon II\Phase-3\backend\src\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\models\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\models\task.py
  - D:\Hackathon II\Phase-3\backend\src\models\conversation.py
  - D:\Hackathon II\Phase-3\backend\src\models\database.py
  - D:\Hackathon II\Phase-3\backend\src\services\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\services\task_service.py
  - D:\Hackathon II\Phase-3\backend\src\services\mcp_tools.py
  - D:\Hackathon II\Phase-3\backend\src\services\chat_service.py
  - D:\Hackathon II\Phase-3\backend\src\api\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\api\routers\chat.py
  - D:\Hackathon II\Phase-3\backend\src\api\routers\mcp.py
  - D:\Hackathon II\Phase-3\backend\src\core\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\core\config.py
  - D:\Hackathon II\Phase-3\backend\src\utils\__init__.py
  - D:\Hackathon II\Phase-3\backend\src\main.py
  - D:\Hackathon II\Phase-3\backend\.env.example
  - D:\Hackathon II\Phase-3\backend\README.md
tests_yaml: []
prompt_text: |
  /sp.implement I need to build Phase 3 of my hackathon project - an AI chatbot for managing todos using MCP (Model Context Protocol) architecture.

  REQUIREMENTS:
  1. Create a Python FastAPI backend in a new /backend folder
  2. Build an MCP server that exposes todo operations as tools (add_task, list_tasks, complete_task, delete_task, update_task)
  3. Use Gemini API (not OpenAI) for the AI agent since I don't have OpenAI credits
  4. Create a stateless chat endpoint that stores conversation history in the database
  5. The chatbot should understand natural language commands like "add task to buy groceries", "show my pending tasks", "mark task 5 as complete", etc.

  CURRENT SETUP:
  - Frontend: Next.js (already built in Phase 2) with NextAuth authentication
  - Database: Neon PostgreSQL (already set up with users and todos tables)
  - I have a Gemini API key ready

  TECH STACK FOR BACKEND:
  - Python FastAPI
  - Gemini API for AI (instead of OpenAI Agents SDK)
  - Official MCP SDK (@modelcontextprotocol/sdk for Python)
  - SQLModel for ORM
  - Neon PostgreSQL (reuse existing database)

  MCP TOOLS NEEDED:
  1. add_task(user_id, title, description?) → creates task
  2. list_tasks(user_id, status?) → lists tasks (all/pending/completed)
  3. complete_task(user_id, task_id) → marks task complete
  4. delete_task(user_id, task_id) → deletes task  
  5. update_task(user_id, task_id, title?, description?) → updates task

  CONVERSATION FLOW (Stateless):
  1. User sends message to /api/chat endpoint
  2. Fetch conversation history from database
  3. Send history + new message to Gemini
  4. Gemini decides which MCP tool(s) to call
  5. Execute tools and get results
  6. Store conversation in database
  7. Return response

  DATABASE ADDITIONS NEEDED:
  - Create a "conversations" or "chat_messages" table to store chat history
  - Schema: id, user_id, role (user/assistant), content, timestamp

  STEPS:
  1. Set up Python FastAPI project structure in /backend folder
  2. Install dependencies: fastapi, uvicorn, sqlmodel, google-generativeai, mcp sdk
  3. Create MCP server with the 5 tools that connect to existing Neon database
  4. Create /chat endpoint that uses Gemini with function calling (tool use)
  5. Implement conversation history storage
  6. Add CORS to allow Next.js frontend to call the backend

  Please create the complete backend structure with all necessary files, configurations, and a README for setup.
response_text: |
  Perfect! I've completed all the required tasks for Phase 3 of your hackathon project. Let me create a summary of what has been implemented:

  ## Summary of Implementation

  I've successfully built the AI chatbot for managing todos using MCP (Model Context Protocol) architecture with the following components:

  ### Backend Structure Created
  - `/backend` directory with proper Python project structure
  - `/src/models` - Database models for tasks and conversations using SQLModel
  - `/src/services` - Business logic for task operations and chat functionality
  - `/src/api/routers` - API endpoints for chat and MCP
  - `/src/core` - Configuration management
  - `/src/utils` - Utility functions

  ### Key Features Implemented

  1. **MCP Server with 5 Tools**:
     - `add_task(user_id, title, description?)` - Creates tasks
     - `list_tasks(user_id, status?)` - Lists tasks (all/pending/completed)
     - `complete_task(user_id, task_id)` - Marks task complete
     - `delete_task(user_id, task_id)` - Deletes task
     - `update_task(user_id, task_id, title?, description?)` - Updates task

  2. **AI Chat Endpoint**:
     - `/api/chat` endpoint that integrates with Google's Gemini API
     - Natural language processing for todo commands
     - Function calling to execute MCP tools based on AI decisions

  3. **Conversation History Storage**:
     - Database model for storing chat messages
     - Automatic storage of user and AI messages
     - Retrieval of conversation history for context

  4. **Database Integration**:
     - SQLModel ORM with Neon PostgreSQL
     - Proper models for tasks and conversations
     - Connection to existing database structure

  5. **Security & Configuration**:
     - CORS configured for frontend integration
     - Environment variable management
     - JWT token compatibility with frontend auth

  ### Files Created
  - `pyproject.toml` and `requirements.txt` for dependencies
  - All Python modules for models, services, and API
  - Configuration system with `.env.example`
  - Comprehensive README with setup instructions

  ### How to Run
  1. Navigate to the `/backend` directory
  2. Install dependencies: `pip install -r requirements.txt`
  3. Set up environment variables in `.env`
  4. Run the server: `uvicorn src.main:app --reload --port 8000`

  The backend is now ready to integrate with your existing Next.js frontend and provide AI-powered todo management capabilities using natural language commands.
outcome: Completed implementation of Phase 3 backend with MCP server, AI chatbot using Gemini API, and all required components.
evaluation: All requirements from the user have been implemented successfully. The backend includes the MCP server with 5 tools, Gemini API integration, conversation history storage, and proper configuration.
---