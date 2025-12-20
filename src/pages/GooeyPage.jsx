import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { preloadResources } from "../utils/resourcePreloader";
import { usePageTitle } from "../hooks/usePageTitle";
import useFullscreen from "../hooks/useFullscreen";
import { HiOutlineCubeTransparent } from "react-icons/hi2";

// New Modern Components
import SmoothScroll from "../components/common/SmoothScroll";
import ParticleBackground from "../components/backgrounds/ParticleBackground";

// section components
import LoadingSection from "../components/sections/LoadingSection";
import IntroSection from "../components/sections/IntroSection";
import NameSection from "../components/sections/NameSection";
import WhatAmISection from "../components/sections/WhatAmISection";
import SkillsSection from "../components/sections/SkillsSection";
import ModelSection from "../components/sections/ModelSection";
import PhotoSection from "../components/sections/PhotoSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import VibeSection from "../components/sections/VibeSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import ConnectSection from "../components/sections/ConnectSection";

// command toolbar
import CommandToolbar from "../components/my-creation/CommandToolbar/CommandToolbar";

function GooeyPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const navigate = useNavigate();

  usePageTitle("", "gooey");
  useFullscreen();

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
        fetch("https://traana.vercel.app/tra", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
    })();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === "h" && !e.ctrlKey) {
        e.preventDefault();
        setShowKeyboardHelp(!showKeyboardHelp);
      } else if (
        (e.key.toLowerCase() === "h" && e.ctrlKey) ||
        e.key.toLowerCase() === "escape" ||
        e.key.toLowerCase() === "b"
      ) {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, showKeyboardHelp]);

  return (
    <div className="overflow-x-hidden scrollbar-hide bg-white dark:bg-black text-black dark:text-white">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <LoadingSection key="loading" progress={loadingProgress} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full relative"
          >
            <ParticleBackground />
            <SmoothScroll>
              <CommandToolbar showKeyboardHelp={showKeyboardHelp} />

              <div className="relative z-10 flex flex-col items-center w-full pb-32">
                <IntroSection id="intro" modern={true} />
                <NameSection id="name" modern={true} />
                <WhatAmISection id="whatami" modern={true} />
                <SkillsSection id="skills" modern={true} />
                <ModelSection id="model" modern={true} />
                <PhotoSection id="photos" modern={true} />
                <ProjectsSection id="projects" modern={true} />
                <VibeSection id="vibe" modern={true} />
                <ExperienceSection id="acad-achie" modern={true} />
                <ConnectSection id="connect" modern={true} />
              </div>
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        onClick={() => navigate("/")}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
        title="Back to Home (ESC, B, or Ctrl+H)"
      >
        <HiOutlineCubeTransparent
          size={20}
          className="text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-all hover:rotate-120 duration-300"
        />
      </motion.button>
    </div>
  );
}

export default GooeyPage;
