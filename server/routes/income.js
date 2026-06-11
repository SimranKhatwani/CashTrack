import express from 'express';
import auth from '../middleware/auth.js';
import Income from '../models/Income.js';
import { memoryMode, getMemoryStore } from '../config/db.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      return res.json(getMemoryStore().incomes.filter((item) => item.userId === req.user._id));
    }
    const incomes = await Income.find({ userId: req.user._id }).sort({ date: -1 });
    return res.json(incomes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { source, category, amount, date, notes } = req.body;
    if (!source || !category || !amount || !date) return res.status(400).json({ message: 'All fields are required' });
    if (memoryMode.current) {
      const item = { _id: String(Date.now()), userId: req.user._id, source, category, amount: Number(amount), date, notes: notes || '' };
      getMemoryStore().incomes.push(item);
      return res.status(201).json(item);
    }
    const item = await Income.create({ userId: req.user._id, source, category, amount: Number(amount), date, notes: notes || '' });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      const idx = getMemoryStore().incomes.findIndex((item) => item._id === req.params.id && item.userId === req.user._id);
      if (idx === -1) return res.status(404).json({ message: 'Income not found' });
      getMemoryStore().incomes[idx] = { ...getMemoryStore().incomes[idx], ...req.body, amount: Number(req.body.amount || getMemoryStore().incomes[idx].amount) };
      return res.json(getMemoryStore().incomes[idx]);
    }
    const item = await Income.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Income not found' });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      getMemoryStore().incomes = getMemoryStore().incomes.filter((item) => !(item._id === req.params.id && item.userId === req.user._id));
      return res.json({ message: 'Income deleted' });
    }
    await Income.deleteOne({ _id: req.params.id, userId: req.user._id });
    return res.json({ message: 'Income deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
