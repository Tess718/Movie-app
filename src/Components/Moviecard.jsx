const Moviecard = ({ movie, onClick }) => {
  const { title, vote_average, poster_path, release_date, original_language } = movie;

  return (
    <div className="movie-card cursor-pointer" onClick={() => onClick(movie.id)}>
      <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/No-Movie.svg'} alt={title} loading="lazy" />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="Star.svg" alt="star icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'NA'}</p>
            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            <p className="year">{release_date ? release_date.split('-')[0] : 'NA'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moviecard;
