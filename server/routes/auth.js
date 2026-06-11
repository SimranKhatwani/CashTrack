import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { memoryMode, getMemoryStore } from '../config/db.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign({ id: user._id || user.id }, process.env.JWT_SECRET || 'cashtrack-secret', { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

    if (memoryMode.current) {
      const exists = getMemoryStore().users.find((item) => item.email === email);
      if (exists) return res.status(400).json({ message: 'User already exists' });
      const user = { _id: String(Date.now()), name, email, profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', password: await bcrypt.hash(password, 10) };
      getMemoryStore().users.push(user);
      return res.status(201).json({ token: createToken(user), user: { ...user, password: undefined } });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user);
    return res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    if (memoryMode.current) {
      const user = getMemoryStore().users.find((item) => item.email === email);
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
      return res.json({ token: createToken(user), user: { ...user, password: undefined } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    return res.json({ token: createToken(user), user: { ...user.toObject(), password: undefined } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    if (memoryMode.current) {
      const store = getMemoryStore();
      const user = store.users.find((item) => item._id === req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (name) user.name = name;
      if (email) user.email = email;
      if (profileImage) user.profileImage = profileImage;
      if (password) user.password = await bcrypt.hash(password, 10);
      return res.json({ user: { ...user, password: undefined } });
    }

    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (profileImage) update.profileImage = profileImage;
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
