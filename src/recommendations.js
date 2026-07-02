import { databases, Query } from "./appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const WATCHLIST_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WATCHLIST_ID;
const TMDB_API_KEY_V3 = import.meta.env.VITE_TMDB_API_KEY_V3;

export const fetchRecommendations = async (userId) => {
  try {
    // 1. Get the user's watchlist from Appwrite
    const watchlist = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    if (!watchlist.documents.length) {
      return [];
    }

    // 2. Sort by addedAt descending to get the most recent movies first
    const sortedWatchlist = [...watchlist.documents].sort((a, b) => {
      const dateA = new Date(a.addedAt || a.$createdAt || 0);
      const dateB = new Date(b.addedAt || b.$createdAt || 0);
      return dateB - dateA;
    });

    // 3. Select up to 3 most recently added movies
    const sampleMovies = sortedWatchlist.slice(0, 3);

    // 4. Fetch recommendations for each in parallel
    const fetchPromises = sampleMovies.map(async (movie) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.movieId}/recommendations?api_key=${TMDB_API_KEY_V3}`
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.results || [];
      } catch (err) {
        console.error(`Failed to fetch recommendations for movie ${movie.movieId}:`, err);
        return [];
      }
    });

    const resultsArray = await Promise.all(fetchPromises);

    // 5. Merge, deduplicate, and exclude existing watchlist movies
    const uniqueRecommendations = [];
    const seenIds = new Set();
    const watchlistIds = new Set(watchlist.documents.map((m) => m.movieId));

    // Round-robin merge to ensure varied recommendations
    const maxLength = Math.max(...resultsArray.map((arr) => arr.length));
    for (let i = 0; i < maxLength; i++) {
      for (const list of resultsArray) {
        if (list[i]) {
          const recMovie = list[i];
          if (!seenIds.has(recMovie.id) && !watchlistIds.has(recMovie.id)) {
            seenIds.add(recMovie.id);
            uniqueRecommendations.push(recMovie);
          }
        }
      }
    }

    return uniqueRecommendations;
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
};
