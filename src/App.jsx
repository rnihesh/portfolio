import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import useVisibilityOnScroll from "./hooks/useVisibilityOnScroll";
import { preloadResources } from "./utils/resourcePreloader";

// section components
import LoadingSection from "./components/sections/LoadingSection";
import IntroSection from "./components/sections/IntroSection";
import NameSection from "./components/sections/NameSection";
import WhatAmISection from "./components/sections/WhatAmISection";
import SkillsSection from "./components/sections/SkillsSection";
import ModelSection from "./components/sections/ModelSection";
import PhotoSection from "./components/sections/PhotoSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import VibeSection from "./components/sections/VibeSection";

// command toolbar
import CommandToolbar from "./components/my-creation/CommandToolbar/CommandToolbar";

// Animation properties for each section
const firstScreenAnimation = {
  key: "first-screen",
  initial: { opacity: 0, y: -100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 1 },
};

const secondScreenAnimation = {
  key: "second-screen",
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 1 },
};

const thirdScreenAnimation = {
  key: "third-screen",
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.8 },
};

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
  key: "fifth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

const seventhScreenAnimation = {
  key: "fifth-screen",
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.8 },
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const firstScreenRef = useRef(null);

  const {
    showFirstScreen,
    showSecondScreen,
    showThirdScreen,
    showFourthScreen,
    showFifthScreen,
    showSixthScreen,
    showSeventhScreen,
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

  return (
    <div className="overflow-x-hidden scrollbar-hide">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <LoadingSection key="loading" progress={loadingProgress} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-[700vh] w-full relative bg-white dark:bg-black"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeToggle className="fixed top-4 right-4" />
    </div>
  );
}

export default App;
