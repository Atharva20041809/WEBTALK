require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware'); // I need to create this

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("WebTalk Backend is Running!");
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173", "https://vercel.app"], // Allow both local and production
    credentials: true,
  },
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Connected to socket.io - Socket ID:", socket.id);

  // Setup user connection
  socket.on("setup", (userData) => {
    if (!userData || !userData.id) {
      console.log("Invalid user data");
      return;
    }
    
    socket.userData = userData;
    socket.join(userData.id);
    
    // Mark user as online
    onlineUsers.set(userData.id, socket.id);
    socket.broadcast.emit("user online", userData.id);
    
    socket.emit("connected");
    console.log("User setup complete:", userData.id);
  });

  // Join specific chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room:", room);
  });

  // Typing indicators
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // Handle new messages
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      console.log("Invalid chat data");
      return;
    }

    console.log("Broadcasting message to chat:", chat.id);

    // Broadcast to all users in the chat except sender
    chat.users.forEach((chatUser) => {
      const userId = chatUser.userId || chatUser.user?.id;
      
      // Skip sender
      if (userId === newMessageReceived.sender.id) return;

      // Emit to user's room
      io.to(userId).emit("message received", newMessageReceived);
      console.log("Message sent to user:", userId);
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected - Socket ID:", socket.id);
    
    if (socket.userData) {
      onlineUsers.delete(socket.userData.id);
      socket.broadcast.emit("user offline", socket.userData.id);
      console.log("User marked offline:", socket.userData.id);
    }
  });
});
