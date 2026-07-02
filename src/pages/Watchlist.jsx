// Watchlist.jsx
import { useEffect, useState } from "react";
import { account, getWatchlist, removeFromWatchlist } from "../appwrite";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Spinner from "../Components/Spinner";
import Navbar from "../Components/Navbar";

const ITEMS_PER_PAGE = 8; // 1 full row on desktop grid

const Watchlist = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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
      setWatchlist((prev) => {
        const updated = prev.filter((item) => item.$id !== docId);
        // Adjust current page if we deleted the last item on the last page
        const maxPage = Math.ceil(updated.length / ITEMS_PER_PAGE);
        if (currentPage > maxPage && maxPage > 0) {
          setCurrentPage(maxPage);
        }
        return updated;
      });
    } catch (err) {
      console.error("Error removing:", err);
    }
  };

  const year = new Date().getFullYear();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center gap-10 items-center min-h-screen text-white flex-col lg:flex-row">
        <img
          src="https://assets-v2.lottiefiles.com/a/59ae3046-117b-11ee-88a7-ef3838e9662f/r8HuxylbzH.gif"
          className="w-120 rounded"
          alt="Please Login"
        />
        <p className="text-center mt-10 text-3xl">
          Please <Link to={"/auth"} className="text-blue-001">log in</Link> to see your watchlist.
        </p>
      </div>
    );
  }

  // Pagination Calculations
  const totalPages = Math.ceil(watchlist.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentWatchlist = watchlist.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen flex flex-col justify-between text-white bg-primary">
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
        <meta
          property="og:url"
          content="https://tswatchables.netlify.app/watchlist"
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/watchlist-preview.jpg"
        />
      </Helmet>

      <div>
        {/* Render Original Navbar at the top */}
        <div className="bg-img lg:px-[70px] px-5">
          <Navbar user={user} setUser={setUser} setRecs={() => {}} />
        </div>

        {/* Watchlist Main Content matching the screenshot layout */}
        <div className="lg:px-[70px] px-5 py-10">
          {/* Back to Home Link */}
          <div className="mb-6">
            <Link
              to={"/"}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors"
            >
              <ArrowLeft size={16} /> Return Home
            </Link>
          </div>

          {/* Heading and Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Clapperboard />
              <h2 className="text-3xl font-bold">{user.name}'s Watchlist</h2>
              <span className="border border-cyan-500/50 bg-cyan-950/45 text-cyan-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                {watchlist.length} {watchlist.length === 1 ? "Movie" : "Movies"}
              </span>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <p className="text-center text-white text-5xl mt-10">
              No movies added yet.
            </p>
          ) : (
            <>
              {/* Movies Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {currentWatchlist.map((movie) => (
                  <div
                    key={movie.$id}
                    className="bg-gray-900/60 border border-gray-800/80 p-3 rounded-lg relative group transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="rounded w-full object-cover aspect-[2/3]"
                      />
                      {/* Floating Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Avoid navigating or triggering other handlers
                          handleRemove(movie.$id);
                        }}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition-all duration-200 shadow-md transform hover:scale-110"
                        title="Remove from Watchlist"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-white line-clamp-1 mt-3 px-1">
                      {movie.title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded bg-gray-800 border border-gray-700/50 hover:bg-gray-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3.5 py-1.5 rounded text-sm font-semibold transition-colors border cursor-pointer ${
                          currentPage === pageNumber
                            ? "bg-cyan-500 border-cyan-500 text-black"
                            : "bg-gray-800 border-gray-700/50 hover:bg-gray-700/80 text-gray-300"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded bg-gray-800 border border-gray-700/50 hover:bg-gray-700/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Render Original Footer at the bottom */}
      <div className="lg:px-[70px] px-5 w-full">
        <div className="footer text-white mt-20">
          <hr />
          <div className="flex justify-between items-center my-5 flex-col md:flex-row">
            <a href="https://devteslim.netlify.app">
              <p className="text-center text-lg">Built by DevTess</p>
            </a>
            <p>© {year} Watchables. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
