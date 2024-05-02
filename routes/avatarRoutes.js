const express = require('express');
const router = express.Router();
const multer = require('multer');
const jimp = require('jimp');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/authMiddleware');

const User = require('../models/user');

const upload = multer({ dest: 'tmp/' });

async function updateUserAvatarUrl(userId, avatarUrl) {
  const updatedUser = await User.findByIdAndUpdate(userId, { avatarURL: avatarUrl }, { new: true });
  return updatedUser;
}

router.patch('/avatars', authMiddleware, upload.single('avatar'), async (req, res) => {
  console.log('Avatar update request received');
  const { file, user } = req;
  console.log('Received file:', file);
  console.log('User info:', user);
  if (!file) {
    return res.status(400).json({ message: 'No avatar file provided' });
  }

  const imagePath = path.join(__dirname, '../tmp/', file.filename);
  const newFileName = `avatar_${user.id}_${Date.now()}${path.extname(file.originalname)}`;
  const newImagePath = path.join(__dirname, '../public/avatars', newFileName);

  try {
    const image = await jimp.read(imagePath);
    await image.resize(250, 250).writeAsync(newImagePath);
    console.log('Image processed and saved to:', newImagePath);

    await fs.unlink(imagePath);
    console.log('Updating user avatar URL in the database');
    await updateUserAvatarUrl(user.id, `/avatars/${newFileName}`);
    console.log('Database updated with new avatar URL');
    res.status(200).json({ avatarURL: `/avatars/${newFileName}` });
  } catch (error) {
    console.error('Error during avatar update:', error);
    await fs.unlink(imagePath).catch(() => {});
    res.status(500).json({ message: 'Error processing image' });
  }
});

module.exports = router;