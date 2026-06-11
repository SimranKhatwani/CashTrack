import express from 'express';
import auth from '../middleware/auth.js';
import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import { memoryMode, getMemoryStore } from '../config/db.js';

const router = express.Router();

function getSummary(userId) {
  const incomes = memoryMode.current ? getMemoryStore().incomes.filter((item) => item.userId === userId) : [];
  const expenses = memoryMode.current ? getMemoryStore().expenses.filter((item) => item.userId === userId) : [];
  return { incomes, expenses };
}

router.get('/', auth, async (req, res) => {
  try {
    let incomes = [];
    let expenses = [];

    if (memoryMode.current) {
      incomes = getMemoryStore().incomes.filter((item) => item.userId === req.user._id);
      expenses = getMemoryStore().expenses.filter((item) => item.userId === req.user._id);
    } else {
      incomes = await Income.find({ userId: req.user._id });
      expenses = await Expense.find({ userId: req.user._id });
    }

    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    const recent = [...incomes.map((item) => ({ ...item, type: 'Income' })), ...expenses.map((item) => ({ ...item, type: 'Expense' }))]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const categoryBreakdown = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return res.json({
      totalIncome,
      totalExpense,
      balance,
      recent,
      categoryBreakdown,
      incomes,
      expenses
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
