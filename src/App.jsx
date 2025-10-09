import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import { useEffect } from "react";
import Watchlist from "./pages/Watchlist";
import { HelmetProvider } from "react-helmet-async";
import Lenis from '@studio-freight/lenis'












function App() {

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])


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
