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

const fourthScreenAnimation = {
  key: "fourth-screen",
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.8 },
};

const fifthScreenAnimation = {
  key: "fifth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

const sixthScreenAnimation = {
  key: "sixth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

const seventhScreenAnimation = {
  key: "seventh-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

const eighthScreenAnimation = {
  key: "eighth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.8 },
};

const ninthScreenAnimation = {
  key: "ninth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [experienceChoice, setExperienceChoice] = useState(null); // null, 'minimal', or 'gooey'
  const firstScreenRef = useRef(null);

  const {
    showFirstScreen,
    showSecondScreen,
    showThirdScreen,
    showFourthScreen,
    showFifthScreen,
    showSixthScreen,
    showSeventhScreen,
    showEighthScreen,
    showNinthScreen,
  } = useVisibilityOnScroll();

  useEffect(() => {
    preloadResources(setLoadingProgress, setIsLoaded);
  }, []);

  useEffect(() => {
    (async () => {
      const conn = navigator.connection || {};
      const hasBatteryAPI = "getBattery" in navigator;
      let bat = { level: null, charging: null };

      if (hasBatteryAPI) {
        try {
          const battery = await navigator.getBattery();
          bat.level = battery.level;
          bat.charging = battery.charging;
        } catch (e) {
          // console.warn("Battery API error:", e);
        }
      }
      const payload = {
        url: location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        referrer: document.referrer,
        viewport: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        connection: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        touchSupport: "ontouchstart" in window,
        orientation: screen.orientation.type,
        batteryLevel: bat.level,
        charging: bat.charging,
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        pageTitle: document.title,
        timestamp: new Date().toISOString(),
      };

      if (import.meta.env.MODE === "production") {
        fetch("https://tra-7e6267.onrender.com/tra", {
          // fetch("http://localhost:3000/tra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    })();
  }, []);

  const handleExperienceChoice = (choice) => {
    setExperienceChoice(choice);
  };

  const handleBackToChoice = () => {
    setExperienceChoice(null);
  };

  return (
    <div className="overflow-x-hidden scrollbar-hide">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <LoadingSection key="loading" progress={loadingProgress} />
        ) : experienceChoice === null ? (
          <LandingChoiceSection key="choice" onChoice={handleExperienceChoice} />
        ) : experienceChoice === 'minimal' ? (
          <MinimalSection key="minimal" onBackToChoice={handleBackToChoice} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-[900vh] w-full relative bg-white dark:bg-black"
          >
            <CommandToolbar />
            <div className="absolute inset-0 flex flex-col items-center">
              <IntroSection
                id="intro"
                ref={firstScreenRef}
                isVisible={showFirstScreen}
                animationProps={firstScreenAnimation}
              />

              <NameSection
                id="name"
                isVisible={showSecondScreen}
                animationProps={secondScreenAnimation}
              />

              <WhatAmISection
                id="whatami"
                isVisible={showThirdScreen}
                animationProps={thirdScreenAnimation}
              />

              <SkillsSection
                id="skills"
                isVisible={showFourthScreen}
                animationProps={fourthScreenAnimation}
              />

              <ModelSection
                id="model"
                isVisible={showFifthScreen}
                animationProps={fifthScreenAnimation}
              />

              <PhotoSection
                id="photos"
                isVisible={showFifthScreen}
                animationProps={fifthScreenAnimation}
              />

              <ProjectsSection
                id="projects"
                isVisible={showSixthScreen}
                animationProps={sixthScreenAnimation}
              />

              <VibeSection
                id="vibe"
                isVisible={showSeventhScreen}
                animationProps={seventhScreenAnimation}
              />

              <AcadAchieSection
                id="acad-achie"
                isVisible={showEighthScreen}
                animationProps={eighthScreenAnimation}
              />

              <ConnectSection
                id="connect"
                isVisible={showNinthScreen}
                animationProps={ninthScreenAnimation}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeToggle className="fixed top-4 right-4 z-50" />
    </div>
  );
}

export default App;
