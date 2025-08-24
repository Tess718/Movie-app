// Watchlist.jsx
import { useEffect, useState } from "react";
import { account, getWatchlist, removeFromWatchlist } from "../appwrite";
import { ArrowBigLeftDash } from "lucide-react";
import { Link } from "react-router-dom";
import Spinner from "../Components/Spinner";

const Watchlist = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const userRes = await account.get();
        setUser(userRes);

        const list = await getWatchlist(userRes.$id);
        setWatchlist(list);
      } catch (err) {
        console.error("Error loading watchlist:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemove = async (docId) => {
    try {
      await removeFromWatchlist(docId);
      setWatchlist((prev) => prev.filter((item) => item.$id !== docId));
    } catch (err) {
      console.error("Error removing:", err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <Spinner />
  </div> ;
  if (!user) return <p className="text-center mt-10">Please log in to see your watchlist.</p>;

  return (
    <div className="p-6">
        <div className="mb-6 border-b border-gray-700 pb-6">
            <Link to={"/"}>
                <button className="bg-gray-800 text-white px-4 py-2 rounded flex gap-1">
                <ArrowBigLeftDash /> Return to Home
                </button>
            </Link>
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">🎬 {user.name}'s Watchlist</h2>
      {watchlist.length === 0 ? (
        <p>No movies added yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {watchlist.map((movie) => (
            <div key={movie.$id} className="bg-gray-800 p-3 rounded">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded mb-2"
              />
              <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
              <button
                onClick={() => handleRemove(movie.$id)}
                className="mt-2 text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
