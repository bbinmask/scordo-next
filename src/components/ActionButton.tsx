"use client";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { LucideProps } from "lucide-react";
import { useRouter } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes, ButtonHTMLAttributes } from "react";
interface QuickActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  href?: string;
  iconClasses?: ClassValue;
  spanClasses?: ClassValue;
}

export const ActionButton = ({
  title,
  icon: Icon,
  href,
  onClick,
  className,
  spanClasses,
  iconClasses,
  ...rest
}: QuickActionButtonProps) => {
  const router = useRouter();

  return (
    <button
      onClick={(e) => {
        if (href) {
          router.push(href);
        } else if (onClick) {
          onClick(e);
        }
      }}
      className={cn(
        "group relative flex items-center justify-between rounded-xl bg-slate-100 p-4 font-[urbanist] font-semibold shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-slate-200/60 hover:shadow-md dark:bg-slate-800/50 dark:text-slate-300 dark:ring-slate-700/50 dark:hover:bg-slate-800/80 dark:hover:text-white dark:hover:shadow-lg dark:hover:shadow-green-500/10 dark:hover:ring-slate-600",
        className
      )}
      {...rest}
    >
      <span
        className={cn("font-sans tracking-wide text-slate-700 dark:text-slate-300", spanClasses)}
      >
        {title}
      </span>
      {Icon && (
        <Icon
          className={cn(
            "h-5 w-5 text-slate-500 transition-colors group-hover:text-green-600 dark:group-hover:text-green-400",
            iconClasses
          )}
        />
      )}
    </button>
  );
};
