import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, accent, trend }) {
  return (
    <motion.article whileHover={{ y: -4 }} className="rounded-3xl border border-violet-100 bg-white p-5 shadow-lg shadow-violet-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          <p className="mt-1 text-xs text-emerald-600">{trend}</p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: accent }}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </motion.article>
  );
}
