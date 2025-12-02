# WebTalk Testing Guide

## Local Testing Setup

### 1. Start Backend
```bash
cd backend
npm start
```
Should see: "Server running on PORT 3000"

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Should see: "Local: http://localhost:5173/"

## Testing Real-Time Messaging

### Test 1: Two User Chat
1. Open browser window 1 (Regular)
   - Go to http://localhost:5173
   - Sign up as User 1 (e.g., alice@test.com)
   
2. Open browser window 2 (Incognito)
   - Go to http://localhost:5173
   - Sign up as User 2 (e.g., bob@test.com)
   
3. In Window 1 (Alice):
   - Click "Search User"
   - Search for "bob"
   - Click on Bob to start chat
   
4. In Window 2 (Bob):
   - You should see Alice's chat appear in list
   - Click on Alice's chat
   
5. Send messages from both windows
   - ✅ Messages should appear instantly
   - ✅ Typing indicator should show
   - ✅ No page reload needed

### Test 2: Group Chat
1. In Window 1 (Alice):
   - Click "New Group +"
   - Enter group name: "Team Chat"
   - Search and add Bob
   - Click "Create Chat"
   
2. In Window 2 (Bob):
   - Group chat should appear automatically
   - Click on "Team Chat"
   
3. Send messages from both
   - ✅ All members receive messages
   - ✅ Group name shows in header

### Test 3: Page Reload
1. While in a chat, press F5 (reload)
   - ✅ Page loads without 404
   - ✅ Chat remains selected
   - ✅ Messages still visible
   - ✅ Can send new messages

### Test 4: Socket Reconnection
1. Open browser DevTools → Network
2. Change connection to "Offline"
3. Wait 5 seconds
4. Change back to "Online"
   - ✅ Socket reconnects automatically
   - ✅ Messages sync

## Debugging

### Check Socket Connection
Open browser console:
- Should see: "Socket connected successfully"
- Should NOT see: "Socket connection error"

### Check Message Sending
In console when sending message:
- Frontend: "Message sent to user: [userId]"
- Backend terminal: "Broadcasting message to chat: [chatId]"

### Common Issues

**Messages not appearing?**
1. Check backend is running on port 3000
2. Check browser console for errors
3. Verify both users are in the same chat
4. Check MongoDB connection

**Socket not connecting?**
1. Verify backend Socket.IO is running
2. Check CORS settings allow localhost:5173
3. Check firewall settings

**404 on reload?**
1. Ensure vercel.json exists
2. For local testing, it won't affect dev server
3. Important for Vercel deployment

## Production Testing

### Before Deploying
1. Update Socket.IO endpoint:
   - File: `frontend/src/components/SingleChat.jsx`
   - Change: `const ENDPOINT = "https://your-backend.onrender.com"`
   
2. Update backend CORS:
   - File: `backend/index.js`
   - Add your Vercel URL to cors origin array

3. Build frontend:
```bash
cd frontend
npm run build
```

4. Test production build locally:
```bash
npm run preview
```

### After Deploying

1. Test on Vercel URL
2. Test with multiple users
3. Test all features:
   - Login/Signup
   - Search users
   - Send messages
   - Create groups
   - Page reload
   - Socket reconnection

## Performance Checks

- [ ] Messages appear in < 100ms
- [ ] No memory leaks (check DevTools)
- [ ] Socket stays connected
- [ ] No duplicate messages
- [ ] Chat list updates correctly
- [ ] Typing indicators smooth
- [ ] No console errors

## Success Criteria

✅ Two users can chat in real-time
✅ Group chats work with 3+ users
✅ Messages persist in database
✅ Page reload works on all routes
✅ Socket reconnects automatically
✅ Typing indicators show/hide
✅ User search finds all users
✅ Profile modals display correctly
✅ JWT authentication works
✅ No build or runtime errors
