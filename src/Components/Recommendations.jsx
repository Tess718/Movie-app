import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from 'swiper/modules';

const Recommendations = ({ movies, onMovieClick }) => {
  if (!movies.length) {
    return <h2>No recommendations yet.</h2>;
  }

  return (
    <div className="w-full lg:pb-[10%] pb-[30%] md:pb-[15%]">
      <Swiper
        spaceBetween={20}
        loop={true}
        modules={[Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
        slidesPerView={6}
        breakpoints={{
          375: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        className="w-full z-10"
      >

        {movies.map((movie) => (
          <SwiperSlide
            key={movie.id}
            className="flex items-center justify-center text-lg"
             onClick={() => onMovieClick(movie.id)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="block w-50 object-cover rounded cursor-pointer"
            />
            <p className="mt-2 text-sm text-white truncate w-full">
              {movie.title}
            </p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Recommendations;
