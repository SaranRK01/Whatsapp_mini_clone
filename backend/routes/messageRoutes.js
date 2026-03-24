const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getRecentChats,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validate');

// All message routes are protected
router.use(protect);

router.post('/', validateMessage, sendMessage);
router.get('/chats', getRecentChats);
router.get('/:user1/:user2', getMessages);

module.exports = router;
