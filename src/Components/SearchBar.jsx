import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { updateSearchCount } from "../appwrite";
import Spinner from "./Spinner";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const FALLBACK_POSTER = "No-Movie.svg";

const SearchBar = ({ onMovieClick }) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debouncedQuery] = useDebounce(query, 800); // debounce

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true); // start loader
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            debouncedQuery
          )}&page=1`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setResults(data.results || []);

        if (data.results.length > 0) {
          await updateSearchCount(debouncedQuery, data.results[0]);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSelect = (movie) => {
    onMovieClick(movie.id); // parent handles modal
    setQuery(""); // clear input
    setResults([]); // close dropdown
  };

  return (
    <div className="relative search">
      <div className="flex items-center gap-2 rounded">
        <img src="Search.svg" alt="Search" className="w-5 h-5" />
        <input
          type="text"
          placeholder="Search through thousands of movies online"
          className="flex-1 bg-transparent text-white focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* ❌ Clear button (only shows if there's text) */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="text-gray-400 hover:text-white text-lg px-1"
          >
            ×
          </button>
        )}
      </div>

      {/* Loader */}
      {loading && (
        <div className="absolute w-full flex items-center justify-center z-50 p-3 text-center">
          <Spinner />
        </div>
      )}

      {/* No results message */}
      {!loading && debouncedQuery && results.length === 0 && (
        <div className="absolute w-full bg-gray-900 rounded mt-1 p-3 text-gray-400 text-sm shadow-lg z-50 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0">
          😢 No movies found for "{debouncedQuery}"
        </div>
      )}

      {/* Results dropdown */}
      {!loading && results.length > 0 && (
        <ul className="absolute w-full bg-gray-900 rounded mt-1 max-h-64 overflow-y-auto shadow-lg z-50 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {results.map((movie) => (
            <li
              key={movie.id}
              className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelect(movie)}
            >
              <div className="flex gap-6">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : FALLBACK_POSTER
                  }
                  alt={movie.title}
                  className="w-12 h-16 object-cover object-top rounded"
                />
                <p className="text-white">{movie.title}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
