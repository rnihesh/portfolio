import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";

// Pages
import HomePage from "./pages/HomePage";
import MinimalPage from "./pages/MinimalPage";
import GooeyPage from "./pages/GooeyPage";

function App() {
  return (
    <Router>
      <div className="relative">
        <ThemeToggle className="fixed top-4 right-4 z-50" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/minimal" element={<MinimalPage />} />
          <Route path="/gooey" element={<GooeyPage />} />
          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
