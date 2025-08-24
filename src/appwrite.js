// appwrite.js
import { Client, Databases, Account, ID, Query, Permission, Role } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID; // your search/trending collection
const WATCHLIST_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WATCHLIST_ID; // your watchlist collection

// --- Initialize client ---
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query };

// --- WATCHLIST FUNCTIONS ---
export const addToWatchlist = async (userId, movie) => {
  try {
    // Check if this movie already exists in the user's watchlist
    const existing = await databases.listDocuments(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      [
        Query.equal("userId", userId),
        Query.equal("movieId", movie.id), // movieId should be integer in schema
      ]
    );

    if (existing.total > 0) {
      // Already exists, don’t add again
      return { success: false, message: "Movie already in watchlist." };
    }

    // Otherwise create new entry
    await databases.createDocument(
      DATABASE_ID,
      WATCHLIST_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        movieId: movie.id,
        title: movie.title,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        addedAt: new Date().toISOString(),
      }
    );

    return { success: true, message: "Movie added to watchlist!" };
  } catch (err) {
    console.error("Error adding to watchlist:", err);
    throw err;
  }
};

export const getWatchlist = async (userId) => {
  try {
    const res = await databases.listDocuments(DATABASE_ID, WATCHLIST_COLLECTION_ID, [
      Query.equal("userId", userId),
    ]);
    return res.documents;
  } catch (err) {
    console.error("Error fetching watchlist:", err);
    return [];
  }
};

export const removeFromWatchlist = async (docId) => {
  try {
    await databases.deleteDocument(DATABASE_ID, WATCHLIST_COLLECTION_ID, docId);
    return true;
  } catch (err) {
    console.error("Error removing from watchlist:", err);
    throw err;
  }
};

// --- SEARCH / TRENDING FUNCTIONS ---
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(`Error updating search count: ${error}`);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (error) {
    console.error(`Error fetching trending movies: ${error}`);
  }
};
