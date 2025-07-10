const MovieModal = ({ movie, onClose }) => {
  if (!movie) return null;

  const {
    title,
    release_date,
    vote_average,
    poster_path,
    genres = [],
    overview,
    runtime,
    original_language,
    homepage,
    production_companies = [],
    spoken_languages = [],
    status,
    budget,
    revenue,
    tagline,
    production_countries = []
  } = movie;

  const year = release_date ? release_date.split('-')[0] : 'NA';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
      <div className="bg-[#1c1c28] text-white max-w-5xl w-full rounded-2xl p-6 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-300 hover:text-white text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-3xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-400">
          {year} • {movie.adult ? '18+' : 'PG-13'} • {runtime} min
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
            ⭐ {vote_average?.toFixed(1) || 'NA'}
          </div>
        </div>

        {/* Poster + Trailer Section */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w300/${poster_path}`}
            alt={title}
            className="rounded-xl w-full md:w-[200px] object-cover"
          />
          <div className="flex-1">
            <img
              src={`https://image.tmdb.org/t/p/w780/${movie.backdrop_path}`}
              alt="Backdrop"
              className="rounded-xl w-full h-full object-cover"
            />
          </div>
        </div>

          {/* Trailer */}
        <div className="mt-6">
          {movie.trailerKey ? (
              <div className="aspect-video mb-4">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                  frameBorder="0"
                  allowFullScreen
                  title="Movie Trailer"
                ></iframe>
              </div>
            ) : (
              <p>No trailer available.</p>
            )}
        </div>

        {/* Genres */}
        <div className="mt-6 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <span
              key={genre.id}
              className="bg-[#2d2d42] text-sm px-3 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>

        {/* Overview */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300">{overview || 'No description available.'}</p>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p><span className="text-white font-medium">Release date:</span> {release_date}</p>
            <p><span className="text-white font-medium">Status:</span> {status}</p>
            <p>
              <span className="text-white font-medium">Countries:</span>{' '}
              {production_countries.map(c => c.name).join(', ') || 'N/A'}
            </p>
            <p>
              <span className="text-white font-medium">Language:</span>{' '}
              {spoken_languages.map(l => l.english_name).join(', ') || original_language}
            </p>
          </div>
          <div>
            <p><span className="text-white font-medium">Budget:</span> ${budget?.toLocaleString() || 'N/A'}</p>
            <p><span className="text-white font-medium">Revenue:</span> ${revenue?.toLocaleString() || 'N/A'}</p>
            {tagline && (
              <p><span className="text-white font-medium">Tagline:</span> “{tagline}”</p>
            )}
            <p>
              <span className="text-white font-medium">Production:</span>{' '}
              {production_companies.map(c => c.name).join(', ') || 'N/A'}
            </p>
          </div>
        </div>

        {/* Homepage Button */}
        {homepage && (
          <div className="mt-6">
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-gradient-to-r from-pink-002 to-blue-001  text-white px-5 py-2 rounded-full"
            >
              Visit Homepage →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
