---
id: 1
title: Update Project Constitution
stage: constitution
date: 2026-01-19
surface: agent
model: Qwen
feature: none
branch: main
user: User
command: /sp.constitution
labels: [constitution, setup, governance]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
tests:
  - none
---

## Prompt

```
/sp.constitution

Project Name: Hackathon II – Todo Full-Stack Web Application

Purpose:
This project is Phase II of a hackathon using spec-driven development. The goal is to transform a completed Phase I console-based Todo application into a modern, multi-user, full-stack web application with authentication and persistent storage.

Core Principles:
- Spec-driven development is mandatory.
- Specifications are the single source of truth.
- No code should be written without an approved and referenced spec.
- Never assume or invent requirements not explicitly written in specs.
- Follow Phase II scope only. 

Project Scope (Phase II):
- Multi-user Todo web application
- Task CRUD operations (create, read, update, delete, toggle completion)
- User authentication and authorization
- Persistent database storage
- RESTful API architecture
- Frontend and backend developed in a monorepo

Technology Stack:
Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend:
- Python FastAPI
- SQLModel (ORM)

Database:
- Neon Serverless PostgreSQL

Authentication:
- Better Auth on frontend
- JWT-based authentication
- Backend must verify JWT using shared secret
- All API routes require valid JWT

Architecture Rules:
- Monorepo structure is required
- Frontend and backend must be in separate folders
- All API routes must be under `/api`
- Backend must enforce task ownership using authenticated user ID
- No direct trust of user_id from client without JWT verification

Spec Organization:
All specifications must live inside `/specs` and follow this structure:
- /specs/overview.md → Project overview and current phase
- /specs/features/ → Feature specifications (task-crud, authentication)
- /specs/api/ → REST API contracts
- /specs/database/ → Database schema and models
- /specs/ui/ → UI components and pages

Development Rules for AI (Qwen):
- Always read relevant specs before implementation
- Reference specs explicitly when implementing features
- Follow folder-specific rules if CLAUDE.md-equivalent instructions exist
- Keep frontend and backend concerns strictly separated
- Write clean, readable, production-style code
- Do not over-engineer or add unnecessary features

Phases:
- Phase 1: Console Todo App (completed, reference only)
- Phase 2: Full-Stack Web App with Auth (current)
- Phase 3: AI Chatbot Interface (future, not in scope)

Workflow:
1. Write or update specs
2. Review specs for clarity
3. Implement backend according to specs
4. Implement frontend according to specs
5. Test and refine
6. Update specs if behavior changes

Enforcement:
If a request violates specs, phase scope, or constitution rules, the AI must stop and ask for clarification instead of proceeding.
```

## Response snapshot

Updated the project constitution file with all the specified principles and requirements. Created a new constitution document at `.specify/memory/constitution.md` with the following key elements:

1. Six core principles focusing on spec-driven development, compliance with specifications, and technology stack requirements
2. Detailed technology stack sections for frontend, backend, database, and authentication
3. Architecture rules for monorepo structure and API design
4. Spec organization guidelines
5. Development rules for AI implementation
6. Project phases and workflow

Also updated dependent templates to align with the new constitution:
- Modified plan-template.md to include constitution compliance checks
- Updated spec-template.md to include constitution compliance requirement
- Updated tasks-template.md to include constitution compliance requirement

The constitution version was set to 1.1.0 to reflect the addition of new principles and sections.

## Outcome

- ✅ Impact: Updated project constitution with comprehensive guidelines for the Hackathon II project
- 🧪 Tests: No automated tests for this change
- 📁 Files: Updated constitution.md and three template files
- 🔁 Next prompts: Ready to create feature specifications based on the new constitution
- 🧠 Reflection: The constitution provides a solid foundation for spec-driven development in the project

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): Standard constitution update
- Next experiment (smallest change to try): Begin creating feature specifications based on the new constitution
