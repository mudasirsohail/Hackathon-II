# Todo MCP Backend

An AI Chatbot for managing todos using Model Context Protocol (MCP) architecture. This backend provides an intelligent chat interface that understands natural language commands to manage your todo list.

## Features

- Natural language processing for todo management
- AI-powered chatbot using Google's Gemini API
- MCP (Model Context Protocol) server exposing todo operations as tools
- Secure user authentication and data isolation
- Conversation history storage
- RESTful API endpoints

## Architecture

The backend consists of:
- FastAPI application server
- SQLModel ORM with Neon PostgreSQL database
- MCP server with 5 todo management tools
- Gemini AI integration for natural language understanding
- Conversation history management

## Prerequisites

- Python 3.8+
- Google Gemini API key
- Neon PostgreSQL database

## Setup

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment variables file and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SECRET_KEY`: A random secret key for JWT tokens

5. Run the application:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

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

## Environment Variables

- `DATABASE_URL`: PostgreSQL database connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `SECRET_KEY`: Secret key for JWT tokens
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

## Usage Examples

Natural language commands supported by the chatbot:
- "Add a task to buy groceries"
- "Show my pending tasks"
- "Mark task 5 as complete"
- "Delete task with ID abc123"
- "Update task title to 'New Title'"

## Development

To run with auto-reload during development:
```bash
uvicorn src.main:app --reload
```

To run tests:
```bash
pytest
```

## Integration with Frontend

The backend is designed to work with the companion Next.js frontend. The CORS settings allow requests from `http://localhost:3000` by default.

## License

MIT