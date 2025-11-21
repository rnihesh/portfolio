import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const MinimalPage = lazy(() => import("./pages/MinimalPage"));
const GooeyPage = lazy(() => import("./pages/GooeyPage"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black dark:border-t-white"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="relative">
          <ThemeToggle className="fixed top-4 right-4 z-50" />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/minimal" element={<MinimalPage />} />
              <Route path="/gooey" element={<GooeyPage />} />
              {/* Fallback route */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
