const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = async function auth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Test-only shortcut so route tests can focus on business logic.
  if (process.env.NODE_ENV === 'test') {
    const testUserId = req.headers['x-test-user-id'];
    if (testUserId && mongoose.Types.ObjectId.isValid(testUserId)) {
      const user = await User.findById(testUserId);
      if (user) {
        req.user = user;
        return next();
      }
    }
  }

  return res.status(401).json({ message: 'Unauthorized: Please log in' });
};
