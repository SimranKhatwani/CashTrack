import express from 'express';
import auth from '../middleware/auth.js';
import Expense from '../models/Expense.js';
import { memoryMode, getMemoryStore } from '../config/db.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      return res.json(getMemoryStore().expenses.filter((item) => item.userId === req.user._id));
    }
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
    return res.json(expenses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, category, amount, date, notes } = req.body;
    if (!title || !category || !amount || !date) return res.status(400).json({ message: 'All fields are required' });
    if (memoryMode.current) {
      const item = { _id: String(Date.now()), userId: req.user._id, title, category, amount: Number(amount), date, notes: notes || '' };
      getMemoryStore().expenses.push(item);
      return res.status(201).json(item);
    }
    const item = await Expense.create({ userId: req.user._id, title, category, amount: Number(amount), date, notes: notes || '' });
    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      const idx = getMemoryStore().expenses.findIndex((item) => item._id === req.params.id && item.userId === req.user._id);
      if (idx === -1) return res.status(404).json({ message: 'Expense not found' });
      getMemoryStore().expenses[idx] = { ...getMemoryStore().expenses[idx], ...req.body, amount: Number(req.body.amount || getMemoryStore().expenses[idx].amount) };
      return res.json(getMemoryStore().expenses[idx]);
    }
    const item = await Expense.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Expense not found' });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (memoryMode.current) {
      getMemoryStore().expenses = getMemoryStore().expenses.filter((item) => !(item._id === req.params.id && item.userId === req.user._id));
      return res.json({ message: 'Expense deleted' });
    }
    await Expense.deleteOne({ _id: req.params.id, userId: req.user._id });
    return res.json({ message: 'Expense deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
