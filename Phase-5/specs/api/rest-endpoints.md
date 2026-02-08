# Feature Specification: REST API Contract for Phase II

**Feature Branch**: `api-contract`
**Created**: 2026-01-19
**Status**: Draft
**Input**: User description: "Create the file `specs/api/rest-endpoints.md`. This file should define the REST API contract for Phase II. Include: - Base URL for development and production - Authentication requirements using JWT - All task-related endpoints for Phase II - Purpose and behavior of each endpoint - Request headers and request body (conceptual) - Response description (high-level) - Error cases and status codes Rules: - All endpoints must require a valid JWT token - Backend must derive user_id from JWT, not client input - Only return or modify tasks owned by authenticated user - Do not write implementation code - Do not reference FastAPI or frontend libraries - Follow the constitution rules"
**Constitution Compliance**: All features must comply with project constitution requirements

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Authenticate and Access Tasks (Priority: P1)

As an authenticated user, I want to access my tasks through the API so that I can manage them from the frontend application.

**Why this priority**: This is the core functionality that enables the todo application - users must be able to authenticate and access their tasks.

**Independent Test**: Can be fully tested by authenticating with a valid JWT and performing CRUD operations on tasks.

**Acceptance Scenarios**:

1. **Given** a user with a valid JWT token, **When** they make an API request to retrieve tasks, **Then** they receive only their own tasks
2. **Given** a user with an invalid or missing JWT token, **When** they make an API request, **Then** they receive an authentication error

---

### User Story 2 - Perform Task CRUD Operations (Priority: P2)

As an authenticated user, I want to create, read, update, and delete my tasks through the API so that I can manage my todo list effectively.

**Why this priority**: This implements the core task management functionality that users expect.

**Independent Test**: Can be tested by having an authenticated user perform all CRUD operations on their tasks.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a new task via API, **Then** the task is stored and returned with a unique identifier
2. **Given** an authenticated user with existing tasks, **When** they update a task via API, **Then** the changes are persisted and reflected
3. **Given** an authenticated user with existing tasks, **When** they delete a task via API, **Then** the task is removed from their list

---

### User Story 3 - Toggle Task Completion Status (Priority: P3)

As an authenticated user, I want to toggle the completion status of my tasks through the API so that I can track my progress.

**Why this priority**: This is a key feature of a todo application that allows users to mark tasks as complete/incomplete.

**Independent Test**: Can be tested by having an authenticated user toggle the completion status of their tasks.

**Acceptance Scenarios**:

1. **Given** an authenticated user with an incomplete task, **When** they update the task's completion status to complete via API, **Then** the task is marked as completed
2. **Given** an authenticated user with a completed task, **When** they update the task's completion status to incomplete via API, **Then** the task is marked as incomplete

---

### Edge Cases

- What happens when a user tries to access or modify another user's task?
- How does the API handle malformed JWT tokens?
- What occurs when the request body contains invalid data?
- How does the API handle concurrent requests from the same user?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All API endpoints MUST require a valid JWT token in the Authorization header
- **FR-002**: API MUST derive user_id from the JWT token, NOT from client-provided data
- **FR-003**: API MUST only return or modify tasks owned by the authenticated user
- **FR-004**: API MUST provide endpoints for task creation (POST), retrieval (GET), update (PUT/PATCH), and deletion (DELETE)
- **FR-005**: API MUST support toggling task completion status through appropriate endpoints
- **FR-006**: API MUST return appropriate HTTP status codes for all responses
- **FR-007**: API MUST validate request payloads and return appropriate error responses for invalid data
- **FR-008**: API MUST handle authentication failures gracefully with clear error messages
- **FR-009**: API MUST provide consistent response formats for all endpoints
- **FR-010**: API MUST implement rate limiting to prevent abuse

### Key Entities *(include if feature involves data)*

- **User**: Represents an authenticated user identified by user_id extracted from JWT token
- **Task**: Represents a user's todo item with properties like title, description, completion status, and ownership reference

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of authenticated API requests return responses within 500ms under normal load
- **SC-002**: API successfully authenticates 99.9% of valid JWT tokens
- **SC-003**: Users can only access or modify their own tasks (0% unauthorized cross-user access)
- **SC-004**: API returns appropriate error responses for 100% of invalid requests
- **SC-005**: 98% of valid task operations (CRUD) complete successfully