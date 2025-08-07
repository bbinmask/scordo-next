import Link from "next/link";

export default function Card({ title, desc, link, className }: any) {
  return (
    <Link
      href={link}
      className={`relative flex transform cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl p-6 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${className} h-48 w-full bg-cover bg-center`}
    >
      <div className="absolute inset-0 rounded-xl bg-black bg-opacity-40"></div>
      <h3 className="relative z-10 mb-2 text-center text-2xl font-bold">
        {title}
      </h3>
      <p className="relative z-10 text-center text-sm opacity-90">{desc}</p>
    </Link>
  );
}
