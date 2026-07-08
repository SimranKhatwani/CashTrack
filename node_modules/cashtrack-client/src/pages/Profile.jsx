import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [preview, setPreview] = useState(user?.profileImage || '');
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', profileImage: user?.profileImage || '', password: '' }
  });

  const onSubmit = async (values) => {
    await updateProfile(values);
    reset(values);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="rounded-[32px] bg-white p-8 shadow-xl shadow-violet-100">
        <p className="text-sm uppercase tracking-[0.35em] text-violet-500">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">Account settings</h1>
      </motion.div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.section className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold">Profile Summary</h2><div className="mt-4 flex items-center gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-700"><FaUserCircle className="text-5xl" /></div><div><p className="text-lg font-semibold text-slate-800">{user?.name}</p><p className="text-sm text-slate-500">{user?.email}</p><p className="mt-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Premium Workspace</p></div></div><div className="mt-6 grid gap-3 text-sm text-slate-600"><div className="rounded-2xl bg-violet-50 p-4">Account status: Active</div><div className="rounded-2xl bg-violet-50 p-4">Last login: Today</div></div></motion.section>
        <motion.section className="rounded-[32px] bg-white p-6 shadow-xl shadow-violet-100"><h2 className="text-xl font-semibold">Update Account</h2><form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">{['name','email','profileImage','password'].map((field) => <label key={field} className="block text-sm font-semibold text-slate-700">{field === 'password' ? 'New Password' : field.charAt(0).toUpperCase() + field.slice(1)}<input {...register(field)} type={field === 'password' ? 'password' : 'text'} onChange={(e) => field === 'profileImage' ? setPreview(e.target.value) : null} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder={field === 'profileImage' ? 'Image URL' : ''} /></label>)}<button className="w-full rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white">Save Changes</button></form>{preview && <img src={preview} alt="Preview" className="mt-4 h-24 w-24 rounded-3xl object-cover" />}</motion.section>
      </div>
    </div>
  );
}
