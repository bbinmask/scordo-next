"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Spinner from "@/components/extras/Spinner";
import SearchResults from "./SearchResults";
import useAxios from "@/hooks/FetchData";
import { CricketTeamCard } from "@/components/Team/TeamsList";
import { Input } from "@/components/ui/input";
import { user } from "@/constants";

// const SearchPage = () => {
//   const userInfo = user;

//   const [results, setResults] = useState([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const { fetchData } = useAxios();

//   const handleFollow = async (id) => {
//     const response = await fetchData("/api/request/follow", "POST", { id });

//     if (response?.success) {
//     } else {
//       setError("Failed to follow user. Please try again.");
//     }
//   };

//   const handleUnfollow = async (id) => {
//     const response = await fetchData("/api/request/unfollow", "POST", { id });
//     if (response?.success) {
//     } else {
//       setError("Failed to unfollow user. Please try again.");
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (query.length > 1) {
//         fetchUsers(query);
//       } else {
//         setResults([]);
//         setLoading(false);
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [query]);

//   const fetchUsers = async (search) => {
//     setLoading(true);
//     try {
//       const res = await fetchData(`/api/search?q=${search}`);
//       if (res?.success) {
//         setResults(res.users);
//       }
//     } catch (error) {
//       console.error("Search failed:", error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="flex w-full flex-col items-center">
//       <div className="flex w-full max-w-[500px] flex-col justify-center pt-6">
//         <div className="text-center">
//           <div className="">
//             <h3>Search players</h3>
//             <div className="small-search-wrap">
//               <form action="" onSubmit={(e) => e.preventDefault()}>
//                 <div className="mt-4 flex px-8">
//                   <input
//                     type="text"
//                     placeholder="@username"
//                     maxLength={query.startsWith("@", 0) ? 16 : 35}
//                     required
//                     minLength={query.startsWith("@", 0) ? 4 : 2}
//                     onChange={(e) => setQuery(e.target.value)}
//                     className="w-full rounded-l-md border-b-2 border-l-2 border-r-0 border-t-2 p-2 font-serif outline-none"
//                     name="name"
//                     id="name"
//                   />
//                   <button className="rounded-r-md border-b-2 border-l-0 border-r-2 border-t-2 bg-white px-3">
//                     <BiSearch className="h-6 w-6 hover:h-7 hover:w-7 hover:translate-x-1" />
//                   </button>
//                 </div>
//               </form>
//             </div>
//             <hr className="small invisible" />
//           </div>
//           {results.length > 0 && (
//             <div className="col-md-12">
//               <div className="v-heading-v2">
//                 <h4 className="v-search-result-count font-roboto text-lg font-medium">
//                   {results.length} search results found for {query}
//                 </h4>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="mt-12">
//           <ul className="m-0 px-2">
//             {results?.length === 0 && !loading ? (
//               <h1 className="text-center font-roboto text-xl">
//                 Search for players
//               </h1>
//             ) : (
//               results?.length === 0 &&
//               loading && (
//                 <div className="flex w-full flex-col items-center gap-6">
//                   <h1>Searching</h1>
//                   <Spinner />
//                 </div>
//               )
//             )}

//             {/* Showing the results */}

//             {results.length > 0 && (
//               <SearchResults
//                 handleUnfollow={handleUnfollow}
//                 results={results}
//                 userInfo={userInfo}
//                 handleFollow={handleFollow}
//               />
//             )}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchPage;

///////////////////

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      setError(null);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="w-full py-4">
      <h1 className="heading-text mb-8 text-center text-4xl font-extrabold">
        Search Cricket Data
      </h1>
      <div className="center mb-8 flex w-full px-16">
        <Input
          type="text"
          placeholder="Search teams, players, or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="subheading-text w-full rounded-md shadow-lg outline-none transition duration-150 ease-in-out"
        />
      </div>
      {loading && (
        <div className="text-center text-xl text-gray-600">Searching...</div>
      )}
      {error && <div className="text-center text-xl text-red-500">{error}</div>}

      {!loading &&
        !error &&
        searchTerm.trim() !== "" &&
        searchResults.length === 0 && (
          <div className="text-center text-xl text-gray-600">
            No results found for "{searchTerm}".
          </div>
        )}

      {!loading && searchResults.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.map((team) => (
            <CricketTeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
