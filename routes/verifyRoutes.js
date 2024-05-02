const express = require('express');
const router = express.Router();
const User = require('../models/user');
const emailService = require('../services/emailService');
const { v4: uuidv4 } = require('uuid');

router.get('/verify/:verificationToken', async (req, res) => {
  const { verificationToken } = req.params;
  console.log(`Verification token received: ${verificationToken}`);

  try {
    const user = await User.findOne({ verificationToken });
    console.log(`User found: ${user ? user.email : 'not found'}`);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();
    console.log(`User ${user.email} verified successfully`);

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    console.error('Error during email verification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify', async (req, res) => {
  const { email } = req.body;
  console.log(`Received request to resend verification email to: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.verify) {
      return res.status(400).json({ message: 'Verification has already been passed' });
    }

    if (!user.verificationToken) {
      user.verificationToken = uuidv4();
      await user.save();
    }

    const verificationUrl = `http://localhost:3001/users/verify/${user.verificationToken}`;
    await emailService.sendEmail(
      email,
      'ami.bricks@gmail.com',
      'Weryfikacja adresu email',
      `Kliknij w link, aby zweryfikować swój adres email: ${verificationUrl}`,
      `<strong>Kliknij <a href="${verificationUrl}">tutaj</a>, aby zweryfikować swój adres email.</strong>`
    );
    console.log(`Verification email resent to: ${email}`);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;