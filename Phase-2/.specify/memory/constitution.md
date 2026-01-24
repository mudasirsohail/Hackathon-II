<!-- SYNC IMPACT REPORT
Version change: 1.0.0 → 1.1.0
Modified principles: 
- Principle 1: Template → Spec-driven development is mandatory
- Principle 2: Template → Specifications are the single source of truth  
- Principle 3: Template → No code without approved spec
- Principle 4: Template → Never assume requirements
- Principle 5: Template → Follow Phase II scope only
- Principle 6: Template → Technology stack requirements
Added sections: Technology Stack, Architecture Rules, Spec Organization, Development Rules for AI, Phases, Workflow, Enforcement
Removed sections: None
Templates requiring updates: 
- .specify/templates/plan-template.md ✅ updated
- .specify/templates/spec-template.md ✅ updated  
- .specify/templates/tasks-template.md ✅ updated
- .specify/templates/commands/*.md ⚠ pending
Follow-up TODOs: None
-->

# Hackathon II – Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-driven development is mandatory
All development must follow spec-driven development methodology. No code should be written without an approved and referenced spec. Specifications are the single source of truth for all requirements and implementation details.

### II. Specifications are the single source of truth
Specifications must be comprehensive, accurate, and up-to-date. All features and functionality must be defined in specs before implementation begins. Any deviation from specs requires spec updates first.

### III. No code without approved spec
No code should be written without an approved and referenced spec. All implementation must directly correspond to approved specifications. If a request violates specs, implementation must stop and clarification must be sought.

### IV. Never assume or invent requirements
Never assume or invent requirements not explicitly written in specs. All functionality must be derived from documented specifications. When requirements are unclear, clarification must be sought rather than assumptions made.

### V. Follow Phase II scope only
Implementation must strictly adhere to Phase II scope: Multi-user Todo web application with authentication and persistent storage. Features outside this scope should not be implemented unless explicitly approved.

### VI. Technology Stack Compliance
All development must use the specified technology stack: Next.js/TypeScript/Tailwind CSS for frontend, Python FastAPI/SQLModel for backend, and Neon Serverless PostgreSQL for database. Deviations require explicit approval.

## Technology Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Python FastAPI
- SQLModel (ORM)

### Database
- Neon Serverless PostgreSQL

### Authentication
- Better Auth on frontend
- JWT-based authentication
- Backend must verify JWT using shared secret
- All API routes require valid JWT

## Architecture Rules
- Monorepo structure is required
- Frontend and backend must be in separate folders
- All API routes must be under `/api`
- Backend must enforce task ownership using authenticated user ID
- No direct trust of user_id from client without JWT verification

## Spec Organization
All specifications must live inside `/specs` and follow this structure:
- /specs/overview.md → Project overview and current phase
- /specs/features/ → Feature specifications (task-crud, authentication)
- /specs/api/ → REST API contracts
- /specs/database/ → Database schema and models
- /specs/ui/ → UI components and pages

## Development Rules for AI (Qwen)
- Always read relevant specs before implementation
- Reference specs explicitly when implementing features
- Follow folder-specific rules if equivalent instructions exist
- Keep frontend and backend concerns strictly separated
- Write clean, readable, production-style code
- Do not over-engineer or add unnecessary features

## Phases
- Phase 1: Console Todo App (completed, reference only)
- Phase 2: Full-Stack Web App with Auth (current)
- Phase 3: AI Chatbot Interface (future, not in scope)

## Workflow
1. Write or update specs
2. Review specs for clarity
3. Implement backend according to specs
4. Implement frontend according to specs
5. Test and refine
6. Update specs if behavior changes

## Enforcement
If a request violates specs, phase scope, or constitution rules, the AI must stop and ask for clarification instead of proceeding.

## Governance

This constitution supersedes all other development practices. Amendments require formal documentation and approval. All pull requests and reviews must verify compliance with these principles. Complexity must be justified with clear benefits. Use specification documents for runtime development guidance.

**Version**: 1.1.0 | **Ratified**: 2026-01-19 | **Last Amended**: 2026-01-19