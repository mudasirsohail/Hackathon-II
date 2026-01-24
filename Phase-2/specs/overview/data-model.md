# Data Model: Phase II Todo Application

**Date**: 2026-01-19
**Feature**: Full-Stack Todo Application
**Status**: Completed

## Overview

This document defines the data model for the Phase II Todo Application, based on the database schema specification and other feature requirements. The model enforces user isolation and secure task management as required by the specifications.

## Entity Definitions

### Task Entity

**Description**: Represents a user's todo item with properties for tracking and management.

**Fields**:
- `id` (UUID/String): Unique identifier for the task
- `title` (String, required, 1-200 characters): Brief description of the task
- `description` (String, optional, 0-1000 characters): Detailed description of the task
- `completed` (Boolean): Flag indicating if the task is completed
- `user_id` (String): Reference to the authenticated user who owns the task (from JWT)
- `created_at` (DateTime): Timestamp when the task was created
- `updated_at` (DateTime): Timestamp when the task was last updated

**Relationships**:
- Belongs to a User (referenced by user_id from Better Auth)

**Validation Rules**:
- Title is required and must be between 1-200 characters
- Description is optional and must be between 0-1000 characters
- user_id must match the authenticated user from JWT token
- completed defaults to false when creating a new task

**State Transitions**:
- Creation: New task with completed=false
- Update: Task details can be modified by owner
- Toggle Completion: completed status can be switched by owner
- Deletion: Task can be deleted by owner

### User Entity (External Reference)

**Description**: Represents an authenticated user managed by Better Auth system.

**Fields** (managed by Better Auth):
- `user_id` (String): Unique identifier for the user
- Additional user profile information managed by Better Auth

**Relationships**:
- Has many Tasks (one-to-many relationship)

**Access Control**:
- All task operations must be validated against the authenticated user_id from JWT
- Users can only access, modify, or delete their own tasks

## Database Schema Considerations

### Indexes
- Index on `user_id` for efficient retrieval of user-specific tasks
- Index on `completed` for filtering completed/incompleted tasks if needed
- Composite index on `user_id` and `completed` for common query patterns

### Constraints
- Foreign key constraint linking user_id to Better Auth user system
- Not-null constraints on required fields (id, title, user_id)
- Check constraints for field length validation

## Security Considerations

### Data Isolation
- All queries must filter by user_id to ensure users only see their own tasks
- Backend must verify user_id from JWT token, not from client-provided data
- No direct manipulation of user_id field in task records

### Audit Trail
- Creation and modification timestamps for tracking changes
- Potential for additional audit fields if needed for debugging purposes