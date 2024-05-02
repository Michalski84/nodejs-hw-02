const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const gravatar = require('gravatar');
const emailService = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/signup', async (req, res) => {
  try {
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    console.log(`Original password for ${email}:`, password);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email in use' });
    }

    const avatarURL = gravatar.url(email, { s: '250', r: 'pg', d: 'mm' });
const hashedPassword = await bcrypt.hash(password, 12);
console.log(`Hashed password for ${email}:`, hashedPassword);
    const verificationToken = uuidv4();

    const newUser = new User({ email, password: hashedPassword, avatarURL, verificationToken });
    await newUser.save();
    console.log(`New user created, sending verification email to: ${email}`);

    const verificationUrl = `http://localhost:3001/users/verify/${verificationToken}`;
    await emailService.sendEmail(
      email,
      'ami.bricks@gmail.com',
      'Weryfikacja adresu email',
      `Proszę kliknij na poniższy link, aby zweryfikować swój adres email: ${verificationUrl}`,
      `<strong>Proszę kliknij <a href="${verificationUrl}">tutaj</a>, aby zweryfikować swój adres email.</strong>`
    );
    console.log(`Verification email sent to: ${email}`);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(400).json({ message: 'Bad request' });
  }
});

module.exports = router;