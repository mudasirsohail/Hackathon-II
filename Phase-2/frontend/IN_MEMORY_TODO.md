# Todo App - Client-Side Only Implementation

This is a simplified todo application that runs entirely on the client side with in-memory storage. All data is lost when the page refreshes.

## Features

- Add new tasks
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- All data stored in-memory (resets on page refresh)

## Architecture

- Frontend: Next.js application
- State Management: React hooks (useState, useEffect)
- Data Storage: In-memory JavaScript objects
- No backend server required
- No authentication required
- No database required

## How It Works

1. All task operations (CRUD) are handled in-memory using JavaScript
2. The `inMemoryApi.ts` file simulates API calls with delays to mimic network requests
3. Data persists only in the browser's memory until page refresh
4. When the page is refreshed, all tasks are cleared

## Files

- `lib/inMemoryApi.ts` - Contains all in-memory data operations
- `lib/api.ts` - Redirects API calls to in-memory functions
- `app/tasks/page.tsx` - Main tasks dashboard (no auth required)
- `app/login/page.tsx` - Redirects to tasks page (auth removed)
- `app/signup/page.tsx` - Redirects to tasks page (auth removed)

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Visit `http://localhost:3000` to access the application

## Note

This implementation is for demonstration purposes only. In a production environment, you would typically want to persist data using localStorage, IndexedDB, or a backend service.