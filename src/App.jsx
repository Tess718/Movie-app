import {useState, useEffect} from 'react'
import { useDebounce } from 'use-debounce';
import Search from './Components/Search'
import Spinner from './Components/Spinner';
import Moviecard from './Components/Moviecard';
import { getTrendingMovies, updateSearchCount } from './appwrite';
import Navbar from './Components/Navbar';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY =  import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  Method: 'GET',
  headers: {
    accept: 'application/json',
    authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000); 


  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try{
      const endpoint = query 
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();

      if (data.response === false){
        setErrorMessage(data.error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0]);
      }
    } catch(error){
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies please try again later')
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    }catch(error){
      console.error(`Error loading trending movies: ${error}`)
  }
}



  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  },[])


  const year = new Date().getFullYear();

  return (
    <div className='lg:px-[70px] px-5'>
      <Navbar />
      <div className='flex md:pt-[10%] items-center justify-between flex-col-reverse md:flex-row gap-10 lg:gap-0'>
        <div className='basis-1/2'>
            <h1 className='lg:text-6xl md:text-4xl md:leading-12 lg:leading-tight text-3xl text-center md:text-start'>FIND MOVIES <br /> <span className='text-gradient'>TVSHOWS AND MORE</span> </h1>
            <p className='text-white text-center md:text-start'>Discover the ultimate movie hub, where cinema lovers explore the latest blockbusters, timeless classics, and hidden gems. Dive into reviews, trailers, and exclusive behind-the-scenes content, all in one place!</p>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        <div className="basis-1/2 mt-20 md:mt-0">
        <div className='flex md:justify-end justify-center'>
          <img src="https://i.pinimg.com/736x/46/7d/94/467d9422c34a27a813e84d4da80a0cb1.jpg" className='lg:h-[500px] h-[250px] md:w-1/2  object-center object-cover relative z-3 -mr-[25%] md:mr-0' alt="" />
          <img src="https://i.pinimg.com/736x/98/e9/02/98e9023feae76e0ec5ed55df24f95b85.jpg" className='lg:h-[500px] h-[250px] md:w-1/2  object-center md:-ml-[25%] -mt-20  object-cover' alt="" />
        </div>
        </div>
      </div>

      {trendingMovies.length > 0 && (
        <section className='trending' id='trending'>
          <h2 className=''>Trending Movies</h2>
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

      <section className='all-movies' id='all-movies'>
          <h2 className=''>All Movies</h2>

          {isLoading ? (
            <div className='grid place-content-center'>
              <Spinner />
            </div>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : ( <ul>
            {movieList.map((movie) => (
              <Moviecard key={movie.id} movie={movie}/>
            ))}
          </ul>
          )}  
      </section>

      <div className="footer text-white mt-20">
        <hr />
        <div className="flex justify-between items-center my-5 flex-col md:flex-row">
          <a href="https://devteslim.netlify.app"><p className='text-center text-lg'>Built by DevTess</p></a>
          <p>© {year} Watchables. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default App