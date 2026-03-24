export const CategoryChip = ({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex cursor-pointer items-center gap-2 rounded-2xl border px-6 py-3 font-sans whitespace-nowrap transition-all duration-300 ${
      active
        ? "scale-105 border-emerald-500 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
        : "border-slate-200 bg-white text-slate-500 hover:border-emerald-500/50 dark:border-white/5 dark:bg-slate-900"
    }`}
  >
    <Icon size={16} className={active ? "animate-pulse" : ""} />
    <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
  </button>
);
