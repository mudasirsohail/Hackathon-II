---
id: 1
title: Fix-Gemini-API-Model-Name-Issue
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement The Gemini API call is failing because the model name is incorrect.
labels: ["bug-fix", "api", "gemini", "model"]
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

$ARGUMENTS
The Gemini API call is failing because the model name is incorrect.

Error: "404 models/gemini-1.5-flash is not found for API version v1beta"

The correct Gemini model name should be one of these:
- "gemini-1.5-flash-latest" (recommended - fast and free)
- "gemini-1.5-pro-latest" (more capable but slower)
- "gemini-2.0-flash-exp" (experimental, newest)

Please fix the backend code:

1. Find where the Gemini model is initialized in the chat service
2. Change the model name from "gemini-1.5-flash" to "gemini-1.5-flash-latest"
3. Make sure it's using the google.generativeai library correctly
4. Ensure function calling / tool use is properly configured for the model

The model initialization should look something like:
model = genai.GenerativeModel('gemini-1.5-flash-latest')

Fix the model name and make sure the Gemini API integration works properly with function calling for the MCP tools.

## Response snapshot

I have successfully fixed the Gemini API model name issue in the backend. Here's what I did:

### Problem Identified
The issue was in `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` where the code was trying to initialize the Gemini model with outdated model names:
- `"gemini-1.5-flash"` (incorrect - causes 404 error)
- `"models/gemini-1.5-flash"` (incorrect - causes 404 error)

### Changes Made

1. **Updated Model Names**:
   - Replaced the old model names with the correct ones that are currently available:
     - `"gemini-1.5-flash-latest"` (recommended - fast and free)
     - `"gemini-1.5-pro-latest"` (more capable but slower)
     - `"gemini-2.0-flash-exp"` (experimental, newest)
   - Kept the old names as fallback options for backward compatibility

2. **Enhanced Function Calling Support**:
   - Added proper tool definitions for the MCP tools (add_task, list_tasks, complete_task, delete_task, update_task)
   - Implemented proper function calling workflow to handle tool responses correctly
   - Updated the message handling to process function calls and send responses back to the model

3. **Improved Error Handling**:
   - Maintained the fallback mechanism to try different model names if one fails
   - Enhanced logging to show which model was successfully initialized

### Files Modified
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Updated model initialization and function calling logic

### Testing Performed
- Verified that the new model names can be initialized properly
- Ran existing tests (`test_chat.py` and `test_connection.py`) to ensure no regressions
- All tests pass successfully

The fix ensures that the application will now use the correct Gemini model names that are currently available in the API, resolving the "404 models/gemini-1.5-flash is not found for API version v1beta" error. The implementation also properly supports function calling for the MCP tools as required.

## Outcome

- ✅ Impact: Fixed the 404 error when initializing the Gemini model by updating to the correct model names
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Modified chat_service.py to update model names and enhance function calling
- 🔁 Next prompts: None needed - issue is resolved
- 🧠 Reflection: The fix was straightforward but required understanding of the function calling mechanism for MCP tools

## Evaluation notes (flywheel)

- Failure modes observed: None - all tests pass
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A