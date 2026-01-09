import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Card({ title, desc, link, className }: any) {
  return (
    <Link
      href={link}
      className={`relative flex transform cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${className} h-48 w-full bg-cover bg-center`}
    >
      <div className="bg-opacity-40 absolute inset-0 rounded-xl bg-black"></div>
      <h3 className="relative z-10 mb-2 text-center text-2xl font-bold">{title}</h3>
      <p className="relative z-10 text-center text-sm opacity-90">{desc}</p>
    </Link>
  );
}

export const NewCard = ({
  title,
  desc,
  link,
  icon,
}: {
  title: string;
  desc: string;
  link: string;
  icon: React.ReactNode;
}) => {
  return (
    <Link href={link} className="group block">
      <div className="hover-card rounded-2xl">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-green-100 p-3 text-green-700 dark:bg-green-900/50 dark:text-green-300">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
              <p className="mt-1 font-[poppins] text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end px-6 py-3">
          <span className="text-sm font-semibold text-green-700 group-hover:text-green-800 dark:text-green-400 dark:group-hover:text-green-300">
            Go to {title}
          </span>
          <ChevronRight className="ml-1 h-5 w-5 transform text-green-700 transition-transform duration-300 group-hover:translate-x-1 dark:text-green-400" />
        </div>
      </div>
    </Link>
  );
};
