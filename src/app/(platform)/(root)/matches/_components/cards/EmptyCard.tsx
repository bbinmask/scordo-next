import { PlusCircle, Sword } from "lucide-react";
import Link from "next/link";

interface EmptyCardProps {
  type: "teams" | "matches" | "tournaments";
  Icon: React.ReactNode;
  title: string;
  linkText: string;
  href: string;
  description: string;
}

export const EmptyCard = ({ type, Icon, title, linkText, href, description }: EmptyCardProps) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 hover-card flex min-h-[16rem] w-full flex-col items-center justify-center rounded-[2.5rem] border p-8 transition-all duration-700">
    <div className="relative mb-4">
      <div className="animate-bounce rounded-3xl bg-slate-100 p-4 text-slate-400 duration-[3000ms] dark:bg-slate-800 dark:text-slate-600">
        {Icon}
      </div>
    </div>
    <div className="mb-6 max-w-xs text-center">
      <h4 className="mb-1 text-lg font-black tracking-tighter text-slate-900 uppercase dark:text-white">
        {title}
      </h4>
      <p className="text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
        {description || `No ${type} found. Create a new ${type.slice(0, -1)} to get started.`}
      </p>
    </div>
    <Link
      href={href}
      className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-green-500/20 transition-all hover:scale-105 hover:bg-green-700 active:scale-95"
    >
      <PlusCircle className="h-3 w-3" /> {linkText}
    </Link>
  </div>
);
