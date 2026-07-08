import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      await registerUser(values.name, values.email, values.password);
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#7C3AED_0%,#6D28D9_45%,#4C1D95_100%)] p-4 text-white md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[32px] bg-white text-slate-800 shadow-2xl">
        <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-violet-500">CashTrack</p>
          <h1 className="mt-3 text-4xl font-bold">Create your finance workspace</h1>
          <p className="mt-3 text-slate-500">Start tracking income, expenses, and cash flow in minutes.</p>
          <div className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Full Name
              <input {...register('name', { required: 'Name is required' })} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400" placeholder="Alex Morgan" />
            </label>
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            <label className="block text-sm font-semibold text-slate-700">Email
              <input {...register('email', { required: 'Email is required' })} type="email" className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-400" placeholder="you@example.com" />
            </label>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            <label className="block text-sm font-semibold text-slate-700">Password
              <div className="mt-1 flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })} type={show ? 'text' : 'password'} className="w-full bg-transparent outline-none" placeholder="••••••••" />
                <button type="button" onClick={() => setShow(!show)} className="ml-2 text-violet-600">{show ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </label>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="mt-8 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60">{isSubmitting ? 'Creating account...' : 'Create Account'}</button>
          <p className="mt-4 text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-violet-600">Sign in</Link></p>
        </motion.form>
        <div className="hidden w-1/2 bg-[linear-gradient(160deg,#ede9fe_0%,#ddd6fe_45%,#f5f3ff_100%)] p-10 md:flex md:flex-col md:justify-center">
          <h2 className="text-3xl font-bold text-violet-800">Modern controls, elegant analytics</h2>
          <p className="mt-3 max-w-sm text-slate-600">Set up goals, track spending, and manage every cash move from one polished workspace.</p>
          <div className="mt-8 grid gap-4 rounded-3xl bg-white p-6 shadow-xl">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">Budget overview</div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">Expense trends</div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-sm text-slate-700">Income goals</div>
          </div>
        </div>
      </div>
    </div>
  );
}
