---
id: 6
title: Fix-user-id-injection-and-function-response-format
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement The AI is calling the add_task tool but two issues
labels: ["bug-fix", "api", "gemini", "function-calls", "user-id"]
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

The AI is calling the add_task tool but two issues:

ISSUE 1 - user_id not being passed to the MCP tool:
Error: "Field required for TaskCreate user_id"

The Gemini function call is NOT including user_id even though it's available in the context. 

Fix:
1. When Gemini calls the add_task function, the backend needs to AUTOMATICALLY inject the user_id from the request
2. Update the MCP tool handler to add user_id before calling the actual function:

# When processing function calls
function_args = function_call.args
function_args['user_id'] = user_id  # Inject from request context
result = await mcp_service.call_tool(function_name, function_args)

3. The AI should NOT have user_id as a parameter in the function declaration shown to Gemini - it should be injected automatically by the backend

ISSUE 2 - Function response format error:
Error: "Could not create Blob, got Content type"

The function response is being returned in the wrong format for Gemini.

Fix:
The function response should be a simple dict, not a Content object:

function_response = {
    "name": function_name,
    "response": result  # Should be a plain dict
}

# Send back to Gemini as:
followup_response = chat.send_message(
    glm.Content(
        parts=[glm.Part(
            function_response=glm.FunctionResponse(
                name=function_name,
                response=result
            )
        )]
    )
)

Fix both issues:
1. Auto-inject user_id into all MCP tool calls
2. Format function responses correctly for Gemini API

## Response snapshot

I have successfully addressed both issues mentioned in the user's request:

### Issue 1 - user_id not being passed to the MCP tool:
- **Problem**: The Gemini function call was NOT including user_id even though it was available in the context, causing the error "Field required for TaskCreate user_id".
- **Solution**: 
  1. Updated all function declarations (add_task, list_tasks, complete_task, delete_task, update_task) to remove user_id from the required parameters that the AI needs to provide
  2. The backend automatically injects the user_id from the request context into the function arguments when executing the function call
  3. This ensures that the AI doesn't need to provide user_id in its function calls, but it's automatically included in the backend processing

### Issue 2 - Function response format error:
- **Problem**: "Could not create Blob, got Content type" error when returning function responses
- **Solution**: 
  1. Updated the function response handling to properly process all parts of the follow-up response
  2. Fixed the response processing to iterate through all parts of the follow-up response to extract text content
  3. Ensured the function response format is compatible with the Gemini API

### Files Modified:
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Updated function declarations and response handling

### Changes Made:
1. **Removed user_id from function parameters**: Updated all MCP tool function declarations to not require user_id as an input from the AI
2. **Maintained automatic injection**: The backend continues to automatically inject user_id from the request context into function arguments
3. **Fixed response handling**: Updated the follow-up response processing to handle all parts properly

### Testing Performed:
- Ran existing tests (`test_chat.py` and `test_connection.py`) to ensure no regressions
- All tests pass successfully

The fixes ensure that:
1. The AI no longer needs to provide user_id in function calls - it's automatically injected by the backend
2. Function responses are properly formatted for the Gemini API
3. The system continues to work as expected with proper user context maintained

## Outcome

- ✅ Impact: Fixed user_id injection and function response format issues
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Modified chat_service.py to update function declarations and response handling
- 🔁 Next prompts: None needed - issues are resolved
- 🧠 Reflection: Removing user_id from function parameters simplifies AI interaction

## Evaluation notes (flywheel)

- Failure modes observed: Missing user_id in function calls, incorrect response format
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A