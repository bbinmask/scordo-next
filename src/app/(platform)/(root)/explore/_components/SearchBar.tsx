import { debounce } from "lodash";
import { Search } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo } from "react";

interface SearchBarProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        router.replace(value ? `${pathname}?query=${encodeURIComponent(value)}` : pathname);
      }, 500),
    [router, pathname]
  );

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSetQuery(value);
  };

  return (
    <div className="relative p-2">
      <input
        value={query}
        onChange={handleChange}
        placeholder="Search users, teams, tournaments..."
        className="w-full rounded-full border border-slate-100 bg-white px-4 py-2 pr-12 pl-6 font-[poppins] text-base font-medium tracking-tight shadow-sm transition-all outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-green-600 lg:py-4 lg:pr-24 lg:text-lg lg:focus:ring-2 dark:border-white/5 dark:bg-slate-900 dark:placeholder:text-slate-700 dark:focus:border-emerald-500"
      />
      <Search className="absolute top-1/2 right-4 -translate-y-1/2 p-1 text-gray-500 lg:right-8" />
    </div>
  );
};
1;

export default SearchBar;
