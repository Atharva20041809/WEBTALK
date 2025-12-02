# WebTalk - Multi-Channel Presence-Aware Messaging Platform

## Project Overview
WebTalk is a secure, real-time messaging application supporting private (1-on-1) and group chats with real-time presence indicators, typing status, and message read receipts.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT-based auth

## Project Structure
```
webtalk/
├── backend/
│   ├── controllers/      # Route controllers (user, chat, message)
│   ├── middleware/       # Auth and error middleware
│   ├── prisma/          # Prisma schema
│   ├── routes/          # API routes
│   ├── index.js         # Entry point (Express + Socket.IO)
│   └── ...
└── frontend/
    ├── src/
    │   ├── animations/   # Lottie animations
    │   ├── components/   # React components
    │   ├── config/       # Chat logic utilities
    │   ├── Context/      # Context API for state
    │   ├── pages/        # Page components
    │   └── ...
    └── ...
```

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/webtalk?retryWrites=true&w=majority"
   JWT_SECRET="your_jwt_secret"
   ```
   *Note: Replace the MongoDB connection string with your own.*
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## Features
- **Authentication**: Login and Signup with JWT.
- **Real-time Messaging**: Instant messaging using Socket.IO.
- **Group Chats**: Create, update, and manage group chats.
- **Typing Indicators**: See when someone is typing.
- **User Search**: Search for users to start a chat.
- **Profile Management**: View user profiles.

## Notes
- Ensure MongoDB is running and accessible.
- The backend runs on port 3000 and frontend on port 5173 by default.
