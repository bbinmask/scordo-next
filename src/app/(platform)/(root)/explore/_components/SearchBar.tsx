import { debounce } from "lodash";
import { Search } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo } from "react";

interface SearchBarProps {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
        className="w-full rounded-full border border-gray-400 px-4 py-2 pr-12 text-base focus:ring-2 focus:ring-green-600"
      />
      <Search className="absolute top-1/2 right-4 -translate-y-1/2 p-1 text-gray-500" />
    </div>
  );
};

export default SearchBar;
