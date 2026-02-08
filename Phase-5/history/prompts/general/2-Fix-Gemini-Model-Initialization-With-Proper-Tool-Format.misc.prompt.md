---
id: 2
title: Fix-Gemini-Model-Initialization-With-Proper-Tool-Format
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement The backend is failing to initialize ANY Gemini model with error
labels: ["bug-fix", "api", "gemini", "model", "tools"]
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

The backend is failing to initialize ANY Gemini model with error: 'object'

All model attempts are failing:
- Failed to initialize model gemini-1.5-flash-latest: 'object'
- Failed to initialize model gemini-1.5-pro-latest: 'object'
- Failed to initialize model gemini-2.0-flash-exp: 'object'

This error suggests there's a problem with how the google.generativeai library is being used.

Please fix:

1. Show me the current .env file structure - verify GEMINI_API_KEY is set correctly
2. Check the chat service code where the model is initialized
3. The proper way to initialize Gemini with function calling is:

import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel(
    model_name='gemini-1.5-flash-latest',
    generation_config={
        "temperature": 0.7,
    }
)

4. Add proper error handling with detailed error messages (not just 'object')
5. Add logging to show:
   - Is the API key loaded? (show first 10 chars)
   - What exact error is happening during model initialization?
   - The full exception details

6. Make sure the google-generativeai library is properly installed: pip install google-generativeai

Fix the model initialization and add detailed error logging so we can see what's actually failing.

## Response snapshot

I have successfully fixed the Gemini API model initialization issue. The problem was with the tool definitions format that was incompatible with the Google Generative AI library. Here's what I did:

### Problems Identified
1. The error message `'object'` was caused by improper exception handling in the model initialization code
2. The tool definitions were using an incorrect format that the Google Generative AI library couldn't parse
3. The library expected tools to be defined using the `genai.protos.Tool` format with proper schema types

### Changes Made

1. **Fixed Tool Definitions Format**:
   - Replaced the JSON-style tool definitions with the proper `genai.protos.Tool` format
   - Used `genai.protos.FunctionDeclaration` with `genai.protos.Schema` for parameters
   - Properly specified parameter types using `genai.protos.Type.STRING`, `genai.protos.Type.INTEGER`, etc.
   - Maintained all the same functionality but with the correct format

2. **Enhanced Error Handling**:
   - Added detailed logging to show the API key preview (first 10 characters)
   - Improved exception handling to show the actual error with `repr(e)` and full tracebacks
   - Added validation to ensure the API key is not empty in the constructor

3. **Maintained Compatibility**:
   - Kept the same model name fallback sequence (starting with the recommended `gemini-1.5-flash-latest`)
   - Preserved the function calling workflow for MCP tools
   - Maintained all existing functionality

### Files Modified
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Updated tool definitions format and error handling

### Testing Performed
- Created and ran tests to verify the new tool format works correctly
- Ran existing tests (`test_chat.py` and `test_connection.py`) to ensure no regressions
- All tests pass successfully

The fix resolves the "object" error by using the correct tool definition format that's compatible with the Google Generative AI library, allowing the models to initialize properly with function calling capabilities for the MCP tools.

## Outcome

- ✅ Impact: Fixed the 'object' error during model initialization by correcting the tool definitions format
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Modified chat_service.py to update tool definitions and error handling
- 🔁 Next prompts: None needed - issue is resolved
- 🧠 Reflection: The issue was with the Google Generative AI library expecting a specific format for tools

## Evaluation notes (flywheel)

- Failure modes observed: Incorrect tool definition format causing KeyError('object')
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A