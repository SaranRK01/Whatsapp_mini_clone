// Validation middleware for user registration
const validateRegister = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

// Validation middleware for sending messages
const validateMessage = (req, res, next) => {
  const { receiver, message } = req.body;
  const errors = [];

  if (!receiver) {
    errors.push('Receiver is required');
  }

  if (!message || !message.trim()) {
    errors.push('Message content cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = { validateRegister, validateMessage };
