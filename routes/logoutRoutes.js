const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

router.get('/logout', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    user.token = null;
    await user.save();
    res.status(204).json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

module.exports = router;