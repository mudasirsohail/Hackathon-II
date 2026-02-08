---
id: 20
title: Migrate-from-Gemini-to-Groq-API
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement URGENT: Switch from Gemini to Groq API - Complete migration
labels: ["migration", "api", "groq", "performance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:\Hackathon II\Phase-3\backend\.env
 - D:\Hackathon II\Phase-3\backend\requirements.txt
 - D:\Hackathon II\Phase-3\backend\src\core\config.py
 - D:\Hackathon II\Phase-3\backend\src\api\routers\chat.py
 - D:\Hackathon II\Phase-3\backend\src\services\chat_service.py
tests:
 - D:\Hackathon II\Phase-3\backend\test_chat.py
 - D:\Hackathon II\Phase-3\backend\test_connection.py
---

## Prompt

URGENT: Switch from Gemini to Groq API - Complete migration

CURRENT SITUATION:
- Gemini API is failing with quota/404 errors
- Switching to Groq API for better reliability and speed

GROQ API KEY:
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

COMPLETE MIGRATION STEPS:

1. INSTALL GROQ SDK:
```bash
   pip install groq
```

2. ADD GROQ_API_KEY TO .env FILE:
GROQ_API_KEY=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

3. REPLACE ALL GEMINI CODE WITH GROQ:

   Find the ChatService or wherever Gemini is used and replace:

   REMOVE:
```python
   import google.generativeai as genai
   genai.configure(api_key=GEMINI_API_KEY)
   model = genai.GenerativeModel('gemini-...')
   response = model.generate_content(prompt)
```

   REPLACE WITH:
```python
   from groq import Groq
   
   client = Groq(api_key=os.getenv('GROQ_API_KEY'))
   
   # For each chat request:
   response = client.chat.completions.create(
       model="llama-3.3-70b-versatile",
       messages=[
           {
               "role": "system", 
               "content": """You are a task management assistant. Understand user intent from natural language.

EXAMPLES:
ADD TASK: "Add task buy groceries" → {"intent": "add", "task_title": "buy groceries"}
LIST: "Show my tasks" → {"intent": "list"}
COMPLETE: "Complete task 5" → {"intent": "complete", "task_id": 5}
DELETE: "Delete task 3" → {"intent": "delete", "task_id": 3}
UPDATE: "Update task 2 to buy milk" → {"intent": "update", "task_id": 2, "task_title": "buy milk"}

Respond ONLY with JSON. Be flexible with phrasing."""
           },
           {"role": "user", "content": user_message}
       ],
       temperature=0.7,
       max_tokens=1000
   )
   
   result = response.choices[0].message.content
```

4. UPDATE requirements.txt:
   Add: groq

5. KEEP THE SAME LOGIC:
   - Parse the JSON response from Groq
   - Call add_task_to_db(), list_tasks_from_db(), etc.
   - Return friendly responses to user

GROQ FREE TIER LIMITS:
- 30 requests/minute
- 14,400 requests/day
- Much better than Gemini!

MIGRATE EVERYTHING FROM GEMINI TO GROQ NOW!

After migration, restart the server and test with: "Add task testing groq"

## Response snapshot

I have successfully migrated the application from Gemini API to Groq API:

### Changes Made:

1. **Installed Groq SDK**: The SDK was already installed, but I added it to requirements.txt

2. **Updated Environment Variables**: Added the GROQ_API_KEY to the .env file

3. **Updated Configuration**: Added GROQ_API_KEY to the settings configuration

4. **Completely Rewrote Chat Service**: Replaced all Gemini code with Groq implementation:
   - Replaced `google.generativeai` with `groq` client
   - Updated model from `gemini-*` to `llama-3.3-70b-versatile`
   - Updated API call format to use `client.chat.completions.create()`
   - Maintained the same logic for parsing JSON responses and calling database functions
   - Kept the same natural language understanding capabilities

5. **Updated API Router**: Changed the chat endpoint to use GROQ_API_KEY instead of GEMINI_API_KEY

### Benefits of Migration:
- **Higher Rate Limits**: Groq offers 30 requests/minute and 14,400 requests/day vs Gemini's limited quotas
- **Better Performance**: Groq's LLM inference is optimized for speed
- **More Reliable**: No more quota/404 errors from Gemini API

### Files Modified:
- `D:\Hackathon II\Phase-3\backend\.env` - Added GROQ_API_KEY
- `D:\Hackathon II\Phase-3\backend\requirements.txt` - Added groq dependency
- `D:\Hackathon II\Phase-3\backend\src\core\config.py` - Added GROQ_API_KEY setting
- `D:\Hackathon II\Phase-3\backend\src\api\routers\chat.py` - Updated to use GROQ_API_KEY
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Complete rewrite with Groq implementation

### Verification:
- All existing tests pass (`test_chat.py` and `test_connection.py`)
- The application now uses Groq API for natural language understanding
- All functionality remains the same from the user perspective
- Better rate limits and reliability

The migration is complete and the application now uses Groq API instead of Gemini API, resolving the quota and reliability issues.

## Outcome

- ✅ Impact: Successfully migrated from Gemini to Groq API, resolving quota issues
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Updated multiple files to use Groq API instead of Gemini
- 🔁 Next prompts: None needed - migration is complete
- 🧠 Reflection: Groq API provides better rate limits and performance

## Evaluation notes (flywheel)

- Failure modes observed: Gemini API quota/404 errors
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A