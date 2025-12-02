# WebTalk - Real-Time Chat Application

A full-stack real-time messaging platform with support for 1-on-1 and group chats, built with React, Node.js, Socket.IO, and MongoDB.

## Features

- ✅ User Authentication (Login/Signup with JWT)
- ✅ Real-time Messaging with Socket.IO
- ✅ 1-on-1 Private Chats
- ✅ Group Chat Creation and Management
- ✅ User Search Functionality
- ✅ Typing Indicators
- ✅ Read Receipts
- ✅ Profile Management
- ✅ Responsive Design

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Socket.IO Client
- Axios
- Simple CSS (no frameworks)

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Prisma ORM
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
webtalk/
├── backend/
│   ├── controllers/
│   │   ├── userControllers.js
│   │   ├── chatControllers.js
│   │   └── messageControllers.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── chatRoutes.js
│   │   └── messageRoutes.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Authentication/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── miscellaneous/
    │   │   │   ├── SideDrawer.jsx
    │   │   │   ├── ProfileModal.jsx
    │   │   │   ├── GroupChatModal.jsx
    │   │   │   └── UpdateGroupChatModal.jsx
    │   │   ├── ChatBox.jsx
    │   │   ├── MyChats.jsx
    │   │   ├── SingleChat.jsx
    │   │   └── ScrollableChat.jsx
    │   ├── Context/
    │   │   └── ChatProvider.jsx
    │   ├── config/
    │   │   └── ChatLogics.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   └── ChatPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3000
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_secret_key"
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
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

The frontend will run on `http://localhost:5173`

## API Endpoints

### User Routes
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user?search=query` - Search users (Protected)

### Chat Routes
- `POST /api/chat` - Create or access 1-on-1 chat (Protected)
- `GET /api/chat` - Fetch all chats for user (Protected)
- `POST /api/chat/group` - Create group chat (Protected)
- `PUT /api/chat/rename` - Rename group (Protected)
- `PUT /api/chat/groupadd` - Add user to group (Protected)
- `PUT /api/chat/groupremove` - Remove user from group (Protected)

### Message Routes
- `GET /api/message/:chatId` - Get all messages in a chat (Protected)
- `POST /api/message` - Send a message (Protected)

## Socket.IO Events

### Client to Server
- `setup` - Initialize user connection
- `join chat` - Join a chat room
- `typing` - User started typing
- `stop typing` - User stopped typing
- `new message` - Send a new message

### Server to Client
- `connected` - Connection established
- `typing` - Someone is typing
- `stop typing` - Someone stopped typing
- `message received` - New message received

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the root directory to `frontend`
4. Deploy

### Backend (Render)
1. Push your code to GitHub
2. Create a new Web Service on Render
3. Set the root directory to `backend`
4. Add environment variables
5. Deploy

## Environment Variables

### Backend
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT

### Frontend
No environment variables required for local development. For production, update API URLs in components to point to your deployed backend.

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database
- [Prisma](https://www.prisma.io/) - ORM
- [JWT](https://jwt.io/) - Authentication

## License

This project is open source and available under the MIT License.
