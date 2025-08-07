import RouteNavigations from "./RouteNavigations";
const RouteHeader = ({ navLinks }: { navLinks: any }) => {
  return (
    <header className="relative flex w-full items-center justify-between border-b border-green-400 pb-6 dark:border-emerald-600">
      <h1 className="h-full text-2xl font-black text-green-800 drop-shadow-lg md:text-4xl dark:text-lime-300">
        Scordo Teams
      </h1>
      <RouteNavigations navLinks={navLinks} />
    </header>
  );
};

export default RouteHeader;
