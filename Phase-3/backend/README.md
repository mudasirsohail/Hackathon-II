# Todo MCP Backend for Hugging Face Spaces

An AI Chatbot for managing todos using Model Context Protocol (MCP) architecture. This backend provides an intelligent chat interface that understands natural language commands to manage your todo list.

## Features

- Natural language processing for todo management
- AI-powered chatbot using Google's Gemini API and Groq
- MCP (Model Context Protocol) server exposing todo operations as tools
- Secure user authentication and data isolation
- Conversation history storage
- RESTful API endpoints

## Architecture

The backend consists of:
- FastAPI application server
- SQLModel ORM with PostgreSQL database
- MCP server with 5 todo management tools
- Gemini AI and Groq integration for natural language understanding
- Conversation history management

## Environment Variables Required

For deployment to Hugging Face Spaces, configure the following environment variables:

- `DATABASE_URL`: PostgreSQL database connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `GROQ_API_KEY`: Groq API key (optional)
- `SECRET_KEY`: Secret key for JWT tokens
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## API Endpoints

- `POST /api/chat` - Chat endpoint for natural language todo management
- `GET /mcp/capabilities` - MCP server capabilities
- `POST /mcp/initialize` - Initialize MCP server
- `POST /mcp/call-tool` - Call an MCP tool directly
- `GET /health` - Health check endpoint

## MCP Tools

The backend exposes the following tools via MCP:

1. `add_task` - Add a new task
2. `list_tasks` - List tasks (with optional status filter)
3. `complete_task` - Mark a task as completed
4. `delete_task` - Delete a task
5. `update_task` - Update a task's title or description

## Usage Examples

Natural language commands supported by the chatbot:
- "Add a task to buy groceries"
- "Show my pending tasks"
- "Mark task 5 as complete"
- "Delete task with ID abc123"
- "Update task title to 'New Title'"

## Hugging Face Spaces Deployment

This backend is configured for deployment on Hugging Face Spaces with Docker. The application runs on port 7860.

## License

MIT