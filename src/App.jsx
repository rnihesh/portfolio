import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";

// Wrapper component to conditionally render ThemeToggle
function ThemeToggleWrapper() {
  const location = useLocation();
  // Hide theme toggle on scroll page
  if (location.pathname === "/scroll") {
    return null;
  }
  return <ThemeToggle className="fixed top-4 right-4 z-50" />;
}

// Pages
import HomePage from "./pages/HomePage";
import MinimalPage from "./pages/MinimalPage";
import GooeyPage from "./pages/GooeyPage";
import ScrollPage from "./pages/ScrollPage";

function App() {
  // Global keyboard handler for resume
  useEffect(() => {
    const handleGlobalKeyPress = (e) => {
      // Check if 'R' key is pressed (case-insensitive)
      if (
        e.key.toLowerCase() === "r" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        // Don't trigger if user is typing in an input field
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          return;
        }
        e.preventDefault();
        window.open("/resume/v7.pdf", "_blank");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => window.removeEventListener("keydown", handleGlobalKeyPress);
  }, []);

  return (
    <Router>
      <div className="relative">
        <ThemeToggleWrapper />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/minimal" element={<MinimalPage />} />
          <Route path="/gooey" element={<GooeyPage />} />
          <Route path="/scroll" element={<ScrollPage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
