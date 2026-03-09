export const StatBox = ({ label, value, subLabel, icon: Icon, color = "emerald" }: any) => (
  <div className="group rounded-[2rem] border border-slate-200 bg-slate-200 p-5 shadow-sm transition-all hover:shadow-md dark:border-white/5 dark:bg-slate-900">
    <div className="mb-3 flex items-start justify-between">
      <div
        className={`rounded-xl p-2.5 bg-${color}-500/10 text-${color}-500 transition-transform group-hover:scale-110`}
      >
        <Icon size={18} />
      </div>
      {subLabel && (
        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          {subLabel}
        </span>
      )}
    </div>
    <p className="mb-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">{label}</p>
    <p className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic dark:text-white">
      {value}
    </p>
  </div>
);
