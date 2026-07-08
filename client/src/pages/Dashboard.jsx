import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaWallet, FaCoins, FaReceipt } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import StatCard from '../components/StatCard';

const palette = ['#7C3AED', '#A78BFA', '#6D28D9', '#10B981', '#F59E0B'];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/api/dashboard').then((res) => setData(res.data)).catch(() => setData({ totalIncome: 0, totalExpense: 0, balance: 0, recent: [], categoryBreakdown: {} }));
  }, []);

  if (!data) return <div className="rounded-3xl bg-white p-8 text-violet-700 shadow-lg">Loading dashboard…</div>;

  const chartData = [
    { name: 'Income', value: data.totalIncome },
    { name: 'Expense', value: data.totalExpense },
    { name: 'Balance', value: data.balance }
  ];

  const categoryData = Object.entries(data.categoryBreakdown || {}).map(([name, value]) => ({ name, value }));
  const recent = data.recent || [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-[32px] bg-white p-8 shadow-xl shadow-violet-100">
        <p className="text-sm uppercase tracking-[0.35em] text-violet-500">Overview</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">Financial Overview</h1>
        <p className="mt-2 text-slate-500">Monitor your balance, income, expenses, and spending patterns all in one place.</p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard icon={FaWallet} label="Total Balance" value={`₹${data.balance.toLocaleString()}`} accent="linear-gradient(135deg,#7C3AED,#6D28D9)" trend="Positive cash flow" />
        <StatCard icon={FaArrowUp} label="Total Income" value={`₹${data.totalIncome.toLocaleString()}`} accent="linear-gradient(135deg,#10B981,#059669)" trend="Last 30 days" />
        <StatCard icon={FaArrowDown} label="Total Expense" value={`₹${data.totalExpense.toLocaleString()}`} accent="linear-gradient(135deg,#EF4444,#DC2626)" trend="Compared to previous month" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <motion.section whileHover={{ y: -2 }} className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold text-slate-800">Financial Overview</h2><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" innerRadius={65} outerRadius={100} paddingAngle={3}><Cell fill="#7C3AED" /><Cell fill="#10B981" /><Cell fill="#EF4444" /></Pie><Tooltip /></PieChart></ResponsiveContainer></div></motion.section>
        <motion.section whileHover={{ y: -2 }} className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold text-slate-800">Category Breakdown</h2><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" innerRadius={55} outerRadius={95}><Cell fill="#7C3AED" /><Cell fill="#A78BFA" /><Cell fill="#6D28D9" /><Cell fill="#10B981" /></Pie><Tooltip /></PieChart></ResponsiveContainer></div></motion.section>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <motion.section whileHover={{ y: -2 }} className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold text-slate-800">Expense Analytics</h2><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#7C3AED" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></motion.section>
        <motion.section whileHover={{ y: -2 }} className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2><div className="mt-4 space-y-3">{recent.length ? recent.map((item) => <div key={item._id} className="flex items-center justify-between rounded-2xl border border-violet-100 bg-violet-50 p-4"><div><p className="font-semibold text-slate-800">{item.source || item.title}</p><p className="text-xs text-slate-500">{item.category} • {item.date}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.type}</span></div>) : <p className="text-sm text-slate-500">No transactions yet.</p>}</div></motion.section>
      </div>
    </div>
  );
}
