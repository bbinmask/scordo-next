interface StatsCardProps {
  title: string;
  value: string;
  iconPath: string;
}

const StatsCard = ({ title, value, iconPath }: StatsCardProps) => {
  return (
    <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-center shadow-md dark:border-emerald-700 dark:bg-emerald-800">
      <div className="mb-4 flex justify-center text-green-800 dark:text-lime-300">
        <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
          <path d={iconPath} />
        </svg>
      </div>
      <h4 className="mb-1 text-3xl font-extrabold text-green-800 dark:text-lime-300">{value}</h4>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
};
