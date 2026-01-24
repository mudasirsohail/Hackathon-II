# Phase II Todo Application - Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Reference](#api-reference)
4. [Security Model](#security-model)
5. [Development Guidelines](#development-guidelines)

## Overview

The Phase II Todo Application is a full-stack, multi-user todo application with authentication and persistent storage. This application transforms a console-based Todo application into a modern, multi-user, full-stack web application with authentication and persistent storage.

### Features
- User authentication and authorization
- Task management (Create, Read, Update, Delete)
- Task completion tracking
- User data isolation
- Responsive web interface

## Architecture

The application follows a monorepo structure with separate backend and frontend components:

### Backend (Python/FastAPI)
- **Framework**: FastAPI
- **Database**: SQLModel with PostgreSQL
- **Authentication**: JWT-based with middleware
- **Structure**:
  - `models/` - Data models (Task, etc.)
  - `services/` - Business logic (task_service.py, auth_service.py)
  - `api/` - API endpoints and routers
  - `middleware/` - Authentication and other middleware
  - `utils/` - Utility functions (JWT handling)
  - `core/` - Core configurations and error handling
  - `database/` - Database configuration and connection

### Frontend (Next.js/TypeScript)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Structure**:
  - `app/` - Page components using App Router
  - `components/` - Reusable UI components
  - `services/` - API service functions
  - `lib/` - Utility functions and helpers
  - `types/` - TypeScript type definitions

## API Reference

### Authentication
All API endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### GET /api/tasks
Retrieve all tasks for the authenticated user.

Response:
```json
[
  {
    "id": 1,
    "title": "Sample task",
    "description": "Sample description",
    "completed": false,
    "user_id": "user123",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
]
```

#### POST /api/tasks
Create a new task for the authenticated user.

Request Body:
```json
{
  "title": "New task",
  "description": "Task description"
}
```

Response:
```json
{
  "id": 2,
  "title": "New task",
  "description": "Task description",
  "completed": false,
  "user_id": "user123",
  "created_at": "2023-01-01T00:00:00",
  "updated_at": "2023-01-01T00:00:00"
}
```

#### GET /api/tasks/{id}
Retrieve a specific task by ID.

#### PUT /api/tasks/{id}
Update an existing task.

#### DELETE /api/tasks/{id}
Delete a specific task.

#### PATCH /api/tasks/{id}/toggle-completion
Toggle the completion status of a task.

## Security Model

### Authentication
- JWT tokens are used for authentication
- Tokens are verified using middleware on protected routes
- User identity is extracted from the JWT token, not from client input

### Authorization
- Users can only access their own tasks
- All task operations are validated against the authenticated user_id
- Unauthorized access attempts return 404 (not found) rather than 403 (forbidden) to prevent user enumeration

### Data Validation
- Input validation is performed on all task fields
- Title must be 1-200 characters
- Description must be less than 1000 characters

## Development Guidelines

### Backend Development
- Use the service layer for business logic
- Validate user ownership of tasks in all operations
- Handle errors appropriately with custom exceptions
- Use dependency injection for authentication

### Frontend Development
- Use the task-api service for all API communications
- Implement proper loading and error states
- Ensure responsive design with Tailwind CSS
- Follow accessibility best practices

### Testing
- Write contract tests for API endpoints
- Write integration tests for user flows
- Test security features like data isolation