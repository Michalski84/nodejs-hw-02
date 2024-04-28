const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    console.log('Received password for login:', password);

    const user = await User.findOne({ email });
    console.log('User found during login:', user);
    console.log('Stored hashed password for login:', user.password);

    const isMatch = user && (await bcrypt.compare(password, user.password));
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email or password is wrong' });
    }
    console.log('Password match:', isMatch);

    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', {
      expiresIn: '1h',
    });

    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: { email: user.email, subscription: user.subscription },
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Bad request' });
  }
});

module.exports = router;