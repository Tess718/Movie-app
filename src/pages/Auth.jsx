// Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account, ID } from "../appwrite";
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from "lucide-react"; // ✅ icons

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle state
  const navigate = useNavigate();

  // --- Password validation ---
  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const number = /\d/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) return "Password must be at least 8 characters";
    if (!upperCase.test(password)) return "Password must contain at least one uppercase letter";
    if (!number.test(password)) return "Password must contain at least one number";
    if (!specialChar.test(password)) return "Password must contain at least one special character";

    return null; 
  };

  // --- Sign up ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType("error");
      return;
    }

    try {
      await account.create(ID.unique(), email, password, username);
      await account.createEmailPasswordSession(email, password); // ✅ auto login
      setMessage("✅ Signup successful! Redirecting...");
      setMessageType("success");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setMessageType("error");
    }
  };

  // --- Log in ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    try {
      await account.createEmailPasswordSession(email, password);
      setMessage("✅ Logged in successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setMessageType("error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-img text-white overflow-x-hidden">
      <Helmet>
        <title>Watchables | Sign In or Create Account</title>
        <meta
          name="description"
          content="Sign in to your Watchables account or create a new one to build your watchlist and get personalized movie recommendations."
        />
      </Helmet>

      <div className="flex">
        <img
          src="https://admin.itsnicethat.com/images/3CzWUmmXvOtHmdH0J1VNY-f9riA=/254910/format-webp%7Cwidth-1440/4._Oppenheimer.jpg"
          alt="auth"
          className="w-96 h-130 object-cover object-top max-sm:hidden rounded-l"
        />
        <div className="bg-gray-800 p-8 shadow-lg w-96 flex flex-col justify-center lg:rounded-r rounded">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {message && (
            <div
              className={`mb-4 text-center text-sm ${
                messageType === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            {!isLogin && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password with eye toggle */}
            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold cursor-pointer"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              className="text-indigo-400 hover:underline cursor-pointer"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setMessageType("");
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
