// Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account, ID } from "../appwrite";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ✅ add username
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // --- Sign up ---
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // ✅ pass username as "name" (Appwrite will save it)
      await account.create(ID.unique(), email, password, username);
      setMessage("✅ Signup successful! You can now log in.");
      setIsLogin(true);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  // --- Log in ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await account.createEmailPasswordSession(email, password);
      setMessage("✅ Logged in successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-img text-white overflow-x-hidden">
      <div className="flex max-md:px-10">
        <img src="https://admin.itsnicethat.com/images/3CzWUmmXvOtHmdH0J1VNY-f9riA=/254910/format-webp%7Cwidth-1440/4._Oppenheimer.jpg" alt="" className="w-96 h-130 object-cover object-top max-sm:hidden rounded-l" />
        <div className="bg-gray-800 p-8 shadow-lg w-96 flex flex-col justify-center rounded-r">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {message && (
            <div className="mb-4 text-center text-sm text-red-400">{message}</div>
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

            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
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
