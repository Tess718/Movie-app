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

    console.log("Watchlist:", watchlist.documents);

    if (!watchlist.documents.length) {
      return [];
    }

    // 2. Pick one movie from the watchlist (first one for now)
    const randomMovie = watchlist.documents[0];
    const movieId = randomMovie.movieId;

    // 3. Fetch recommendations from TMDB using the v3 API key
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY_V3}`
    );

    if (!res.ok) {
      throw new Error(`TMDB request failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("TMDB response:", data);

    return data.results || [];
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
};
