const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.user._id;

    // Validate message content
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty',
      });
    }

    // Validate receiver
    if (!receiver) {
      return res.status(400).json({
        success: false,
        message: 'Receiver is required',
      });
    }

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: 'Receiver user not found',
      });
    }

    // Prevent sending to self
    if (sender.toString() === receiver.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself',
      });
    }

    // Create and save message
    const newMessage = await Message.create({
      sender,
      receiver,
      message: message.trim(),
    });

    // Populate sender and receiver info
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'username avatar isOnline')
      .populate('receiver', 'username avatar isOnline');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages between two users
// @route   GET /api/messages/:user1/:user2
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { user1, user2 } = req.params;

    // Validate both users exist
    const [userOne, userTwo] = await Promise.all([
      User.findById(user1),
      User.findById(user2),
    ]);

    if (!userOne || !userTwo) {
      return res.status(404).json({
        success: false,
        message: 'One or both users not found',
      });
    }

    // Fetch messages in chronological order
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    })
      .populate('sender', 'username avatar isOnline')
      .populate('receiver', 'username avatar isOnline')
      .sort({ createdAt: 1 });

    // Mark messages as read where current user is receiver
    await Message.updateMany(
      { sender: user2, receiver: user1, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent chats (last message with each user)
// @route   GET /api/messages/chats
// @access  Private
const getRecentChats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const recentChats = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastMessageTime: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          _id: '$userInfo._id',
          username: '$userInfo.username',
          avatar: '$userInfo.avatar',
          isOnline: '$userInfo.isOnline',
          lastMessage: 1,
          lastMessageTime: 1,
          unreadCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: recentChats.length,
      data: recentChats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getRecentChats,
};
