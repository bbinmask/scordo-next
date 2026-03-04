import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ query, handleChange }: SearchBarProps) => {
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
