import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryMode, getMemoryStore } from '../config/db.js';

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'cashtrack-secret');
    if (memoryMode.current) {
      const user = getMemoryStore().users.find((item) => item._id === decoded.id);
      if (!user) return res.status(401).json({ message: 'Invalid token' });
      req.user = user;
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
