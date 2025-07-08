import  { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='flex justify-between lg:pt-5 pt-5 pb-12 lg:pb-5 items-center bg-primary text-white'>
      <h2 className='font-bold text-gradient'>Watchables</h2>
      
      <div className='md:hidden'>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <ul className={`md:flex gap-5 absolute md:static max-sm:bg-gray-900 w-full h-full md:h-auto md:w-auto left-0 top-16 md:top-auto px-5 md:px-0 py-5 md:py-0 transition-all z-5 text-center lg:text-start ${isOpen ? 'block' : 'hidden'}`}>
        <a href="#trending" className='block py-2 md:py-0' onClick={()=> setIsOpen(!isOpen)}><li>Trending</li></a>
        <a href="#all-movies" className='block py-2 md:py-0' onClick={()=> setIsOpen(!isOpen)}><li>All movies</li></a>
      </ul>
    </nav>
  );
};

export default Navbar;
