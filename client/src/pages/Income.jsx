import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FaBriefcase, FaMoneyBillWave, FaChartLine, FaGift, FaEllipsisH, FaUserTie } from 'react-icons/fa';
import api from '../services/api';

const incomeCategories = [
  { label: 'Salary', icon: FaBriefcase },
  { label: 'Freelance', icon: FaUserTie },
  { label: 'Business', icon: FaChartLine },
  { label: 'Investment', icon: FaMoneyBillWave },
  { label: 'Gift', icon: FaGift },
  { label: 'Other', icon: FaEllipsisH }
];

export default function Income() {
  const [items, setItems] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    try {
      const res = await api.get('/api/income');
      setItems(res.data);
    } catch {
      toast.error('Failed to load income records');
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      await api.post('/api/income', values);
      toast.success('Income added');
      reset();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add income');
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/api/income/${id}`);
      toast.success('Income removed');
      load();
    } catch {
      toast.error('Failed to delete income');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-[32px] bg-white p-8 shadow-xl shadow-violet-100">
        <p className="text-sm uppercase tracking-[0.35em] text-violet-500">Income</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">Income records</h1>
        <p className="mt-2 text-slate-500">Track your monthly earnings and sources.</p>
      </motion.div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <motion.section className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold">Add Income</h2><form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">{['source','amount','date','notes'].map((field) => <label key={field} className="block text-sm font-semibold text-slate-700">{field.charAt(0).toUpperCase() + field.slice(1)}<input {...register(field, { required: field !== 'notes' })} type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" /></label>)}<label className="block text-sm font-semibold text-slate-700">Category</label><div className="flex flex-wrap gap-2">{incomeCategories.map(({ label, icon: Icon }) => <button type="button" key={label} onClick={() => document.querySelector('select[name="category"]').value = label} className="rounded-full border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-700"><Icon className="mr-1 inline" /> {label}</button>)}</div><select {...register('category', { required: true })} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"><option value="">Select category</option>{incomeCategories.map(({ label }) => <option key={label} value={label}>{label}</option>)}</select><button className="w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white">Save Income</button></form></motion.section>
        <motion.section className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold">Income List</h2><div className="mt-4 space-y-3">{items.length ? items.map((item) => { const Icon = incomeCategories.find((entry) => entry.label === item.category)?.icon || FaEllipsisH; return <div key={item._id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="rounded-2xl bg-white p-2 text-violet-700 shadow-sm"><Icon className="text-lg" /></div><div><p className="font-semibold text-slate-800">{item.source}</p><p className="text-xs text-slate-500">{item.category} • {item.date}</p></div></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">+₹{item.amount}</span></div><p className="mt-2 text-sm text-slate-500">{item.notes || 'No notes added.'}</p><button onClick={() => remove(item._id)} className="mt-3 text-sm text-rose-600">Delete</button></div>; }) : <p className="text-sm text-slate-500">No income entries yet.</p>}</div></motion.section>
      </div>
    </div>
  );
}
