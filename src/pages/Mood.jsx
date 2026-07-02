import { useState } from "react";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

const moods = [
  { name: "Happy", genreId: 35 }, // Comedy
  { name: "Sad", genreId: 18 }, // Drama
  { name: "Romantic", genreId: 10749 }, // Romance
  { name: "Adventurous", genreId: 12 }, // Adventure
  { name: "Chill", genreId: 10751 }, // Family
  { name: "Scary", genreId: 27 }, // Horror
];

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMoviesByMood = async (mood) => {
    setSelectedMood(mood);
    setLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${mood.genreId}&sort_by=popularity.desc&api_key=${
          import.meta.env.VITE_TMDB_API_KEY_V3
        }`
      );
      const data = await res.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error("Error fetching mood movies:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-img text-white px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Find a Movie That Matches Your Mood
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => fetchMoviesByMood(mood)}
            className={`px-4 py-2 rounded-full border ${
              selectedMood?.name === mood.name
                ? "bg-indigo-600 border-indigo-600"
                : "border-gray-500 hover:bg-gray-700"
            }`}
          >
            {mood.name}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && movies.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      )}

      {!loading && selectedMood && movies.length === 0 && (
        <p className="text-center text-gray-400">
          No movies found for {selectedMood.name}.
        </p>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};

export default Mood;
