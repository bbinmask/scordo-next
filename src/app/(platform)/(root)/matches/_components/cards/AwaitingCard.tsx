import { Sword } from "lucide-react";

export const AwaitingCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="animate-in fade-in group hover-card relative overflow-hidden rounded-[3rem] border border-dashed border-slate-200 p-12 text-center font-sans duration-1000 dark:border-white/10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 transition-transform group-hover:scale-110 dark:bg-white/5">
        <Sword className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      </div>
      <h4 className="mb-2 text-xl font-black tracking-tight uppercase">{title}</h4>
      <p className="mx-auto max-w-sm text-xs leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
        {description}{" "}
      </p>
    </div>
  );
};
