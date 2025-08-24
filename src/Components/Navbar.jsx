// Navbar.jsx
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { account } from "../appwrite"; // ✅ import account
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CircleUser, LogOut } from "lucide-react";
import Toast from "./Toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    const [toast, setToast] = useState("");

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // logs out current session
      setUser(null);
      setToast("✅ Logged out successfully!");
      navigate("/"); // redirect to home after logout
    } catch (err) {
      setToast("❌ Error logging out");
      console.log(err);
    }
  };

  return (
    <nav className="flex justify-between lg:pt-5 pt-5 pb-12 lg:pb-5 items-center text-white">
      <h2 className="font-bold text-gradient">Watchables</h2>

      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <ul
        className={`md:flex gap-5 absolute md:static max-sm:bg-gray-900 w-full h-full md:h-auto md:w-auto left-0 top-16 md:top-auto px-5 md:px-0 py-5 md:py-0 transition-all z-5 text-center lg:text-start ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <a
          href="#trending"
          className="block py-2 md:py-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <li>Trending</li>
        </a>
        <a
          href="#all-movies"
          className="block py-2 md:py-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <li>All movies</li>
        </a>

        <li className="block py-2 md:py-0">
          <Link to={"/watchlist"}>WatchList</Link>
        </li>


        {/* Auth Buttons */}
        <div className="max-sm:flex  max-sm:justify-center">
        {user ? (
          <button
             onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}

            className="block py-2 md:py-0 text-red-400 hover:text-red-500 cursor-pointer"
          >
            <LogOut />
          </button>
        ) : (
          <Link
            to={"/auth"}
            className="block py-2 md:py-0 text-indigo-400 hover:text-indigo-500 "
            onClick={() => setIsOpen(false)}
          >
            <CircleUser />
          </Link>
        )}

        </div>
      </ul>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </nav>
  );
};

export default Navbar;
