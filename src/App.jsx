import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </HelmetProvider>
    </>
  );
}

export default App;
