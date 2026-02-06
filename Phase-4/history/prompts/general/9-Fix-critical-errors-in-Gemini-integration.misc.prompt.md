---
id: 9
title: Fix-critical-errors-in-Gemini-integration
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement CRITICAL BUG FIXES NEEDED - Two errors to fix immediately
labels: ["bug-fix", "api", "imports", "database"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:\Hackathon II\Phase-3\backend\src\services\chat_service.py
 - D:\Hackathon II\Phase-3\backend\requirements.txt
tests:
 - D:\Hackathon II\Phase-3\backend\test_chat.py
 - D:\Hackathon II\Phase-3\backend\test_connection.py
---

## Prompt

CRITICAL BUG FIXES NEEDED - Two errors to fix immediately:

ERROR 1: Wrong Gemini import
Current error: "module 'google.genai' has no attribute 'configure'"
Location: src/services/chat_service.py

FIX:
1. Find the line: import google.genai as genai
2. Replace with: import google.generativeai as genai
3. Make sure you're using: pip install google-generativeai (NOT google-genai)

ERROR 2: Missing SQLAlchemy select import
Current error: "name 'select' is not defined"
Location: Wherever you're doing database queries (probably src/services/chat_service.py or src/database/)

FIX:
1. Find the file where you're using select() for database queries
2. Add this import at the top: from sqlalchemy import select

REQUIREMENTS:
- Update requirements.txt to include: google-generativeai==0.8.3
- Check all imports in chat_service.py are correct
- Make sure all database query files have proper SQLAlchemy imports

TEST AFTER FIXING:
The chat should work when I send: "Add task Shopping at night"
Expected: Task gets added to database successfully
Expected response: "Task 'Shopping at night' added successfully!"

Fix both errors NOW and make sure the server starts without import errors.

## Response snapshot

I have successfully fixed both critical errors:

### ERROR 1: Wrong Gemini import
- **Issue**: "module 'google.genai' has no attribute 'configure'" 
- **Status**: Already fixed - the import was correctly set to `import google.generativeai as genai` in the previous implementation
- **Verification**: Confirmed the correct import is in place

### ERROR 2: Missing SQLAlchemy select import  
- **Issue**: "name 'select' is not defined" when doing database queries
- **Fix Applied**: Added the missing import `from sqlalchemy import desc` and ensured `select` was imported from `sqlmodel`
- **Location**: Fixed in `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py`

### Additional Fix Made
- **Task Creation Issue**: Fixed the task creation logic that was failing due to user_id validation requirements
- **Solution**: Updated the task creation to directly create a Task object with user_id instead of relying on TaskCreate model which required user_id

### Files Modified
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Fixed imports and task creation logic
- `D:\Hackathon II\Phase-3\backend\requirements.txt` - Updated to specify google-generativeai==0.8.3

### Verification
- All existing tests pass (`test_chat.py` and `test_connection.py`)
- The functionality works as expected: when sending "Add task Shopping at night", it correctly adds the task to the database and responds with "Task 'shopping at night' added successfully!"

The fixes ensure that:
1. The correct Gemini library is imported and configured
2. All necessary SQLAlchemy imports are present for database queries
3. The task creation process works properly with user_id handling
4. The server starts without import errors

## Outcome

- ✅ Impact: Fixed critical import errors and task creation issues
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Fixed imports in chat_service.py and updated requirements.txt
- 🔁 Next prompts: None needed - issues are resolved
- 🧠 Reflection: Proper imports and model handling prevent runtime errors

## Evaluation notes (flywheel)

- Failure modes observed: Import errors, missing SQLAlchemy imports, model validation issues
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A