// Watchlist.jsx
import { useEffect, useState } from "react";
import { account, getWatchlist, removeFromWatchlist } from "../appwrite";
import { ArrowBigLeftDash } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
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
  if (!user) return <div className="flex justify-center items-center min-h-screen text-white flex-col lg:flex-row">
        <img src="/pls-login.png" alt="Please Login" />
        <p className="text-center mt-10 text-3xl">Please <Link to={"/auth"} className="text-blue-001" >log in</Link> to see your watchlist.</p>
  </div> 

  return (
    <div className="p-6">
      <Helmet>
      <title>Watchables | My Watchlist</title>
      <meta
        name="description"
        content="View and manage your Watchables watchlist. Keep track of movies you want to watch and revisit your saved favorites anytime."
      />
      <meta property="og:title" content="Watchables - My Watchlist" />
      <meta
        property="og:description"
        content="Check your saved movies in Watchables. Organize your watchlist and never lose track of what to watch next."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tswatchables.netlify.app/watchlist" />
      <meta property="og:image" content="https://yourwebsite.com/watchlist-preview.jpg" />
    </Helmet>

        <div className="mb-6 border-b border-gray-700 pb-6">
            <Link to={"/"}>
                <button className="bg-gray-800 text-white px-4 py-2 rounded flex gap-1 cursor-pointer">
                <ArrowBigLeftDash /> Return to Home
                </button>
            </Link>
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">🎬 {user.name}'s Watchlist</h2>
      {watchlist.length === 0 ? (
        <p className="text-center text-white text-5xl">No movies added yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {watchlist.map((movie) => (
            <div key={movie.$id} 
            className="bg-gray-800 p-3 rounded cursor-pointer"
            
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded mb-2"
              />
              <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
              <button
                onClick={() => handleRemove(movie.$id)}
                className="mt-2 text-xs text-red-400 hover:underline cursor-pointer"
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
