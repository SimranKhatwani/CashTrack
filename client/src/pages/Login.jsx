import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#7C3AED_0%,#6D28D9_45%,#4C1D95_100%)] p-4 text-white md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[32px] bg-white text-slate-800 shadow-2xl">
        <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-500">CashTrack</p>
          <h1 className="mt-3 text-4xl font-bold">Track smarter. Spend better.</h1>
          <p className="mt-3 text-slate-500">Enter your details to access your expense dashboard.</p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Email
              <input {...register('email', { required: 'Email is required' })} type="email" className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-violet-400" placeholder="you@example.com" />
            </label>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            <label className="block text-sm font-semibold text-slate-700">Password
              <div className="mt-1 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input {...register('password', { required: 'Password is required' })} type={show ? 'text' : 'password'} className="w-full bg-transparent outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="ml-2 text-violet-600">{show ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </label>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="mt-8 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60">{isSubmitting ? 'Signing in...' : 'Sign In'}</button>
          <p className="mt-4 text-sm text-slate-500">Need an account? <Link to="/register" className="font-semibold text-violet-600">Create one</Link></p>
        </motion.form>
        <div className="hidden w-1/2 bg-[linear-gradient(160deg,#ede9fe_0%,#ddd6fe_45%,#f5f3ff_100%)] p-10 md:flex md:flex-col md:justify-center">
          <h2 className="text-3xl font-bold text-violet-800">All your money moves in one view</h2>
          <p className="mt-3 max-w-sm text-slate-600">See income, expenses, balances, and spending trends instantly from a polished SaaS dashboard.</p>
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-xl">
            <div className="h-3 w-24 rounded-full bg-violet-200"></div>
            <div className="mt-4 grid gap-3">
              {["Total Balance", "Income", "Expenses"].map((item, idx) => <div key={item} className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">{item}: <strong className="text-violet-700">{['₹8,420', '₹12,300', '₹3,880'][idx]}</strong></div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}