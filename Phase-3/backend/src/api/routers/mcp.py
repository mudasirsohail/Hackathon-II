from fastapi import APIRouter, HTTPException
from mcp import server
from mcp.types import InitializeRequestParams
from pydantic import BaseModel
from typing import Dict, Any, List
import asyncio

from ...services.mcp_tools import (
    MCPTaskTools,
    AddTaskParams,
    ListTasksParams,
    CompleteTaskParams,
    DeleteTaskParams,
    UpdateTaskParams
)

router = APIRouter()

# Define the MCP server
mcp_server = server.Server("todo-mcp-server")


@mcp_server.call_tool(validate_input=False)
async def handle_tool_calls(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle all tool calls by dispatching to the appropriate handler.
    
    Args:
        name: The name of the tool to call
        arguments: The arguments to pass to the tool
    """
    try:
        if name == "add_task":
            params = AddTaskParams(**arguments)
            return MCPTaskTools.add_task(params)
        elif name == "list_tasks":
            params = ListTasksParams(**arguments)
            return MCPTaskTools.list_tasks(params)
        elif name == "complete_task":
            params = CompleteTaskParams(**arguments)
            return MCPTaskTools.complete_task(params)
        elif name == "delete_task":
            params = DeleteTaskParams(**arguments)
            return MCPTaskTools.delete_task(params)
        elif name == "update_task":
            params = UpdateTaskParams(**arguments)
            return MCPTaskTools.update_task(params)
        else:
            raise ValueError(f"Unknown tool: {name}")
    except Exception as e:
        return {"error": str(e)}


@router.get("/capabilities")
async def get_capabilities():
    """Return the MCP server capabilities."""
    # Return mock capabilities for now since the actual API is not available in this version of MCP
    from fastapi import Response
    import json
    
    mock_capabilities = {
        "protocols": ["text-dimension"],
        "tools": {
            "listChanged": False
        },
        "prompts": {
            "listChanged": False
        },
        "resources": {
            "listChanged": False
        },
        "logging": {},
        "experimental": {}
    }
    return mock_capabilities


@router.post("/initialize")
async def initialize(initialization_options: InitializeRequestParams):
    """Initialize the MCP server."""
    # Perform any initialization logic here
    return {"result": "initialized"}


@router.post("/call-tool")
async def call_tool(request: Dict[str, Any]):
    """Call an MCP tool."""
    try:
        tool_name = request.get("name")
        tool_params = request.get("arguments", {})
        
        if not tool_name:
            raise HTTPException(status_code=400, detail="Tool name is required")
        
        # Call the appropriate tool handler
        if tool_name == "add_task":
            params = AddTaskParams(**tool_params)
            result = add_task_handler(params)
        elif tool_name == "list_tasks":
            params = ListTasksParams(**tool_params)
            result = list_tasks_handler(params)
        elif tool_name == "complete_task":
            params = CompleteTaskParams(**tool_params)
            result = complete_task_handler(params)
        elif tool_name == "delete_task":
            params = DeleteTaskParams(**tool_params)
            result = delete_task_handler(params)
        elif tool_name == "update_task":
            params = UpdateTaskParams(**tool_params)
            result = update_task_handler(params)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown tool: {tool_name}")
        
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))