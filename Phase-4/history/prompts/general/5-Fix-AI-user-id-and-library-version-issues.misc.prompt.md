---
id: 5
title: Fix-AI-user-id-and-library-version-issues
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement Two issues to fix
labels: ["bug-fix", "api", "gemini", "system-instructions", "library-update"]
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

Two issues to fix:

ISSUE 1 - AI asking for user_id when it's already provided:
The backend is receiving user_id='5a308849-8a9c-4c29-be9a-a496669fa28a' in the request, but Gemini is asking "What is your user ID?" instead of using it.

Fix: Update the system prompt/instructions for the AI to:
- Always use the user_id from the context automatically
- NEVER ask the user for their user_id
- The user_id should be automatically included when calling MCP tools
- System prompt should say something like: "You are a task management assistant. The user is already authenticated with user_id: {user_id}. Use this user_id automatically for all task operations. Never ask for the user_id."

ISSUE 2 - Library version error:
Error: AttributeError: whichOneof. Did you mean: 'WhichOneof'?

Fix: Upgrade the google-generativeai library:
pip install --upgrade google-generativeai

This is a known bug in older versions.

After fixing these:
1. The AI should automatically use the provided user_id
2. When the user says "Add task Groceries", it should call the add_task tool with the user_id from the session
3. The library error should be fixed

Make sure the system instructions clearly tell the AI to use the user_id from context and never ask for it.

## Response snapshot

I have successfully addressed both issues mentioned in the user's request:

### Issue 1 - AI asking for user_id when it's already provided:
- **Problem**: The backend was receiving user_id in the request, but Gemini was asking "What is your user ID?" instead of using it.
- **Solution**: Added a system instruction to the model initialization that explicitly tells the AI:
  - "You are a task management assistant. The user is already authenticated with user_id provided in the session. Use this user_id automatically for all task operations. Never ask the user for their user_id. Always use the user_id from the context automatically."
- **Implementation**: Updated the `genai.GenerativeModel` initialization to include the `system_instruction` parameter.

### Issue 2 - Library version error:
- **Problem**: AttributeError: whichOneof. Did you mean: 'WhichOneof'?
- **Solution**: Upgraded the google-generativeai library from version 0.8.3 to 0.8.6 using `pip install --upgrade google-generativeai`
- **Additional fix**: Corrected the function response handling to use the proper API methods available in the updated library version.

### Additional Improvements:
- Fixed the response handling to properly process function calls and text responses separately
- Corrected the function response mechanism to use the proper Content and Part structures
- Ensured that the user_id is automatically used in all MCP tool calls

### Files Modified:
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Added system instructions and fixed response handling

### Testing Performed:
- Ran existing tests (`test_chat.py` and `test_connection.py`) to ensure no regressions
- All tests pass successfully

The fixes ensure that:
1. The AI automatically uses the provided user_id without asking for it
2. When the user says "Add task Groceries", it should call the add_task tool with the user_id from the session
3. The library error has been fixed with the version upgrade
4. The system instructions clearly tell the AI to use the user_id from context and never ask for it

## Outcome

- ✅ Impact: Fixed AI asking for user_id and resolved library version error
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Modified chat_service.py to add system instructions and fix response handling
- 🔁 Next prompts: None needed - issues are resolved
- 🧠 Reflection: System instructions are effective for guiding AI behavior

## Evaluation notes (flywheel)

- Failure modes observed: AI requesting user_id unnecessarily, library version errors
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A