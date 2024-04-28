const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/current', authMiddleware, async (req, res) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

module.exports = router;