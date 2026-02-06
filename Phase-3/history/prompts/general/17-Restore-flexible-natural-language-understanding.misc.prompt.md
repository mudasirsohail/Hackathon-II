---
id: 17
title: Restore-flexible-natural-language-understanding
stage: misc
date: 2026-02-05
surface: agent
model: gpt-4
feature: none
branch: main
user: user
command: /sp.implement CRITICAL REGRESSION: Chatbot is rigid again - not understanding natural language
labels: ["bug-fix", "ai", "natural-language", "intent-recognition"]
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

CRITICAL REGRESSION: Chatbot is rigid again - not understanding natural language

PROBLEM:
- Previously: "Add task mobile hanging" worked ✓
- Now: "Add task Eating" fails ✗
- You broke the natural language understanding we fixed earlier!

YOU MUST HAVE REVERTED THE CODE!

RESTORE THE FLEXIBLE GEMINI PROMPT:

The Gemini system prompt should be:

"""
You are a task management assistant. Understand user intent from natural language.

EXAMPLES OF VALID COMMANDS:

ADD TASK (extract the task title from ANYWHERE in the message):
- "Add task buy groceries" → title: "buy groceries"
- "Add task Eating" → title: "Eating"
- "Add task mobile hanging" → title: "mobile hanging"  
- "Create a task called fix the bug" → title: "fix the bug"
- "I need to remember to call mom" → title: "call mom"
- "New task: finish homework" → title: "finish homework"

LIST TASKS:
- "Show my tasks", "List tasks", "What are my tasks", "Show me all tasks"

COMPLETE:
- "Complete task 5", "Mark 5 as done", "Finish task 5"

DELETE:
- "Delete task 3", "Remove task 3", "Cancel task 3"

UPDATE:
- "Update task 2 to buy milk", "Change task 2 to buy milk"

RESPOND WITH JSON:
{
  "intent": "add|list|complete|delete|update",
  "task_title": "extracted title",
  "task_id": number
}

Be FLEXIBLE! Extract the task title from the user's message naturally.
"""

DO NOT use regex or exact string matching - use Gemini's AI understanding!

Restore the natural language understanding we had before!

## Response snapshot

I have successfully restored the flexible natural language understanding that was working before. The issue was that the prompt needed to be more explicit about the specific examples mentioned in the problem.

### Changes Made:

1. **Updated the Gemini system prompt**: Enhanced the prompt to include the specific example mentioned in the issue ("Add task Eating" → title: "Eating")
2. **Made the prompt more explicit**: Added clearer instructions about extracting task titles flexibly from user messages
3. **Maintained the AI-based understanding**: Continued to rely on Gemini's AI understanding rather than regex or string matching

### Specific Improvements:

- Added the exact example "Add task Eating" → title: "Eating" to the prompt
- Emphasized that the AI should be flexible in extracting task titles from anywhere in the message
- Maintained the JSON response format for consistency with the rest of the system
- Kept the focus on natural language understanding rather than rigid pattern matching

### Files Modified:
- `D:\Hackathon II\Phase-3\backend\src\services\chat_service.py` - Updated the Gemini prompt for natural language understanding

### Verification:
- All existing tests pass (`test_chat.py` and `test_connection.py`)
- The chatbot should now properly understand phrases like "Add task Eating" and extract "Eating" as the task title
- The system continues to use Gemini's AI for understanding rather than rigid pattern matching

The natural language understanding has been restored and should now properly handle the examples mentioned in the issue, including "Add task Eating" which should extract "Eating" as the task title.

## Outcome

- ✅ Impact: Restored flexible natural language understanding for task creation
- 🧪 Tests: All existing tests pass (test_chat.py, test_connection.py)
- 📁 Files: Updated Gemini prompt in chat_service.py
- 🔁 Next prompts: None needed - issue is resolved
- 🧠 Reflection: Specific examples in prompts improve AI understanding

## Evaluation notes (flywheel)

- Failure modes observed: Rigid parsing instead of flexible AI understanding
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A