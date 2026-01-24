# Quickstart Guide: Phase II Todo Application

**Date**: 2026-01-19
**Feature**: Full-Stack Todo Application
**Status**: Completed

## Overview

This quickstart guide provides instructions for setting up and running the Phase II Todo Application. The application is a full-stack, multi-user todo application with authentication and persistent storage.

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.11 or higher)
- PostgreSQL-compatible database (Neon Serverless PostgreSQL recommended)
- Better Auth account for authentication

## Setup Instructions

### 1. Clone and Initialize the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in the backend directory with the following variables:
```env
DATABASE_URL=<your-postgresql-connection-string>
JWT_SECRET_KEY=<your-jwt-secret-key>
```

#### Database Setup
```bash
# Run database migrations
python -m src.database.migrate
```

#### Start Backend Server
```bash
# From the backend directory
uvicorn src.main:app --reload --port 8000
```

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:
```env
NEXT_PUBLIC_BETTER_AUTH_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### Start Frontend Server
```bash
# From the frontend directory
npm run dev
```

## Running the Application

1. Ensure the backend server is running on `http://localhost:8000`
2. Start the frontend server which will typically run on `http://localhost:3000`
3. Visit the frontend URL in your browser
4. Register a new account or sign in to access the task dashboard

## Development Workflow

1. **Backend Development**: Make changes to the backend in the `backend/` directory
2. **Frontend Development**: Make changes to the frontend in the `frontend/` directory
3. **API Testing**: Use the API endpoints as defined in the contracts
4. **Component Development**: Develop and test UI components in isolation when possible

## Troubleshooting

### Common Issues

- **Database Connection**: Ensure your PostgreSQL connection string is correct
- **Authentication**: Verify that Better Auth is properly configured
- **API Communication**: Check that backend and frontend are communicating correctly
- **Environment Variables**: Ensure all required environment variables are set

### Useful Commands

- **Backend Tests**: `cd backend && pytest`
- **Frontend Tests**: `cd frontend && npm test`
- **Database Migrations**: `cd backend && python -m src.database.migrate`

## Next Steps

1. Explore the API contracts in the `/contracts` directory
2. Review the data model in `/specs/database/data-model.md`
3. Familiarize yourself with the UI components specification
4. Begin implementing the tasks outlined in the project plan