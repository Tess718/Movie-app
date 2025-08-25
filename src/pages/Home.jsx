import {useState, useEffect} from 'react'
import { useDebounce } from 'use-debounce';
import Search from '../Components/Search'
import Spinner from '../Components/Spinner';
import Moviecard from '../Components/Moviecard';
import { getTrendingMovies, updateSearchCount } from '../appwrite';
import Navbar from '../Components/Navbar';
import Moviemodal from '../Components/Moviemodal';
import { fetchRecommendations } from '../recommendations';
import { account } from "../appwrite";
import Recommendations from '../Components/Recommendations';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY =  import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  Method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000); 

  const [selectedMovie, setSelectedMovie] = useState(null)

  const [showModal, setShowModal] = useState(false)

  const [isModalLoading, setIsModalLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [recs, setRecs] = useState([]);

  const [loadingRecs, setLoadingRecs] = useState(true);




 const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    const page1Url = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=1`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=1`;

    const page2Url = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=2`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=2`;

    const [res1, res2] = await Promise.all([
      fetch(page1Url, API_OPTIONS),
      fetch(page2Url, API_OPTIONS),
    ]);

    if (!res1.ok || !res2.ok) throw new Error('Failed to fetch movies');

    const [data1, data2] = await Promise.all([res1.json(), res2.json()]);

    const combined = [...data1.results, ...data2.results].slice(0, 24);

    setMovieList(combined);

    if (query && data1.results.length > 0) {
      await updateSearchCount(query, data1.results[0]);
    }
  } catch (error) {
    console.error(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies, please try again later');
  } finally {
    setIsLoading(false);
  }
};


  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    }catch(error){
      console.error(`Error loading trending movies: ${error}`)
  }
}


const handleMovieClick = async (movieId) => {
  setIsModalLoading(true);
  setSelectedMovie(null);      
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const data = await res.json();

    // fetch trailer
    const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    const videoData = await videoRes.json();

    // Get first YouTube trailer
    const trailer = videoData.results.find(
      (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
    );

    setSelectedMovie({
      ...data,
      trailerKey: trailer?.key || null,
    });

    setShowModal(true);
  } catch (error) {
    console.error('Error loading movie details or trailer:', error);
  }
};


 useEffect(() => {
    const getUserAndRecs = async () => {
      try {
        const current = await account.get();
        setUser(current);

        // kick off recommendations in background
        const recommended = await fetchRecommendations(current.$id);
        setRecs(recommended);
      } catch {
        // not logged in
      } finally {
        setLoadingRecs(false);
      }
    };

    getUserAndRecs();
  }, []);

useEffect(() => {
  if (!user) {
    setRecs([]);
  }
}, [user]);

  


const handleCloseModal = () => {
  setShowModal(false);
  setSelectedMovie(null);
  setIsModalLoading(false); // <-- ensure loading is cleared
};



  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  },[])


  const year = new Date().getFullYear();

  return (
    <div>
      <div className="bg-img lg:px-[70px] px-5">
          <Navbar user={user} setUser={setUser} setRecs={setRecs}/>
        <div className='flex md:pt-[10%] items-center justify-between flex-col-reverse md:flex-row gap-10 lg:gap-0'>
          <div className='basis-1/2'>
              <h1 className='lg:text-6xl md:text-4xl md:leading-12 lg:leading-tight text-3xl text-center md:text-start'>FIND MOVIES <br /> <span className='text-gradient'>TVSHOWS AND MORE</span> </h1>
              <p className='text-white text-center md:text-start'>Discover the ultimate movie hub, where cinema lovers explore the latest blockbusters, timeless classics, and hidden gems. Dive into reviews, trailers, and exclusive behind-the-scenes content, all in one place!</p>

              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
          <div className="basis-1/2 mt-20 md:mt-0">
          <div className='flex md:justify-end justify-center'>
            <img src="https://i.pinimg.com/736x/46/7d/94/467d9422c34a27a813e84d4da80a0cb1.jpg" className='lg:h-[500px] h-[250px] md:w-1/2  object-center object-cover relative z-3 -mr-[25%] md:mr-0 rounded' alt="" />
            <img src="https://i.pinimg.com/736x/98/e9/02/98e9023feae76e0ec5ed55df24f95b85.jpg" className='lg:h-[500px] h-[250px] md:w-1/2  object-center md:-ml-[25%] -mt-20 rounded object-cover' alt="" />
          </div>
          </div>
        </div>
      </div>
      <div className='lg:px-[70px] px-5'>
          {trendingMovies.length > 0 && (
          <section className='trending' id='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


          {user?.name && (
            <section className="mt-10">
              <h2 className='pb-8'>Recommended for {user.name}</h2>
              {loadingRecs ? (
                <div className='grid place-content-center'>
                  <Spinner />
                </div>
              ) : recs.length > 0 ? (
                <Recommendations movies={recs} onMovieClick={handleMovieClick} />
              ) : (
                <p className="text-gray-400">No recommendations yet. Add some movies to your watchlist!</p>
              )}
            </section>
          )}



        <section className='all-movies' id='all-movies'>
            <h2>All Movies</h2>

            {isLoading ? (
              <div className='grid place-content-center'>
                <Spinner />
              </div>
            ) : errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : ( <ul>
              {movieList.map((movie) => (
                <Moviecard key={movie.id} movie={movie} onClick={handleMovieClick} />
              ))}
            </ul>
            )}  
        </section>

        
        
        {isModalLoading && (
          <div className="fixed inset-0 flex items-center justify-center">
            <Spinner /> {/* or any loader */}
          </div>
        )}

        {showModal && selectedMovie && (
          <Moviemodal movie={selectedMovie} onClose={handleCloseModal}/>
        )}

        <div className="footer text-white mt-20">
          <hr />
          <div className="flex justify-between items-center my-5 flex-col md:flex-row">
            <a href="https://devteslim.netlify.app"><p className='text-center text-lg'>Built by DevTess</p></a>
            <p>© {year} Watchables. All rights reserved.</p>
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default Home