const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

// Track online users: Map<userId, socketId>
const onlineUsers = new Map();

const setupSocket = (io) => {
  // Socket.IO authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    console.log(`🟢 User connected: ${socket.username} (${userId})`);

    // Add user to online users
    onlineUsers.set(userId, socket.id);

    // Update user online status in DB
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });

    // Broadcast online status to all users
    io.emit('user:online', {
      userId,
      username: socket.username,
      isOnline: true,
    });

    // Send current online users list to the connected user
    const onlineUserIds = Array.from(onlineUsers.keys());
    socket.emit('users:online', onlineUserIds);

    // ─── Handle sending messages ─────────────────────────────────────
    socket.on('message:send', async (data) => {
      try {
        const { receiver, message } = data;

        if (!message || !message.trim()) return;

        // Save to DB
        const newMessage = await Message.create({
          sender: userId,
          receiver,
          message: message.trim(),
        });

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'username avatar isOnline')
          .populate('receiver', 'username avatar isOnline');

        // Send to sender (confirmation)
        socket.emit('message:received', populatedMessage);

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:received', populatedMessage);
        }
      } catch (error) {
        socket.emit('message:error', { message: 'Failed to send message' });
        console.error('Message send error:', error.message);
      }
    });

    // ─── Handle typing indicator ─────────────────────────────────────
    socket.on('typing:start', (data) => {
      const { receiver } = data;
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:start', {
          userId,
          username: socket.username,
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { receiver } = data;
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:stop', {
          userId,
          username: socket.username,
        });
      }
    });

    // ─── Handle read receipts ────────────────────────────────────────
    socket.on('message:read', async (data) => {
      const { senderId } = data;

      // Mark messages as read
      await Message.updateMany(
        { sender: senderId, receiver: userId, read: false },
        { read: true }
      );

      // Notify sender about read receipts
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message:read', { readBy: userId });
      }
    });

    // ─── Handle disconnection ────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`🔴 User disconnected: ${socket.username} (${userId})`);

      onlineUsers.delete(userId);

      // Update user offline status
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Broadcast offline status
      io.emit('user:offline', {
        userId,
        username: socket.username,
        isOnline: false,
        lastSeen: new Date(),
      });
    });
  });
};

module.exports = setupSocket;
