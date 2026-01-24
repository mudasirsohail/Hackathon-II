# Todo App with Authentication

This is a Next.js full-stack Todo App with user authentication and Neon PostgreSQL database integration.

## Tech Stack

- Full-stack: Next.js (Frontend + API routes)
- Database: Neon PostgreSQL
- Authentication: JWT + bcrypt
- Language: TypeScript

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
DATABASE_URL=""
JWT_SECRET=""
```

Note: The `.env` file in the `2/backend` directory is no longer needed as all backend logic has been integrated into the Next.js application.

**Important Notes:**
- The database connection string and JWT secret have been pre-configured
- Keep these values secure and never commit them to version control

### 2. Database Setup

The database tables have already been created in your Neon database. If you need to recreate them, you can run the initialization script:

```bash
cd 2/backend
npm install
npm run init-db
```

### 3. Install Dependencies

Run the following commands in both the frontend and backend directories:

```bash
# In the frontend directory
cd frontend
npm install

# In the backend directory
cd 2/backend
npm install
```

### 4. Run the Application

Start the Next.js development server:

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Log in to an existing account

### Todos

- `GET /api/todos` - Get all todos for the authenticated user
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a specific todo
- `DELETE /api/todos/:id` - Delete a specific todo

All todo endpoints require authentication via a JWT token in the `Authorization` header as `Bearer {token}`.

## Folder Structure

```
frontend/ (Sole Application Root)
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   └── login/route.ts
│   │   └── todos/
│   │       ├── route.ts (GET, POST)
│   │       └── [id]/route.ts (PUT, DELETE)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── tasks/page.tsx
├── components/
├── lib/
│   ├── api.ts (Authentication and API functions)
│   ├── authMiddleware.ts (Authentication helper)
│   ├── db.ts (Database connection utilities)
│   ├── jwt.ts (JWT utilities)
│   ├── password.ts (Password hashing utilities)
│   └── types.ts (Type definitions)
└── middleware.ts (Route protection)
```

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- Authentication is handled via JWT tokens
- All todo endpoints are protected and scoped to the authenticated user
- Users can only access their own todos