# CashTrack

CashTrack is a modern MERN expense tracker SaaS dashboard with authentication, income/expense management, analytics, and responsive UI.

## Features
- JWT authentication (register, login, protected routes)
- Income and expense tracking
- Dashboard summaries and analytics
- Responsive SaaS-style UI

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts, Framer Motion
- Backend: Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, cors, dotenv

## Getting Started

### 1. Install dependencies
npm install

### 2. Create environment file
Copy the example env file:
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env

### 3. Run the app
npm run dev

This starts:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure
cashtrack/
  client/
  server/

## Notes
- The backend uses MongoDB when available.
- If MongoDB is not reachable, it falls back to in-memory demo storage for local testing.
