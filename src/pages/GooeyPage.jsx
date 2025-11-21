import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useVisibilityOnScroll from "../hooks/useVisibilityOnScroll";
import { preloadResources } from "../utils/resourcePreloader";
import { usePageTitle } from "../hooks/usePageTitle";
import useFullscreen from "../hooks/useFullscreen";
import { sendTelemetry } from "../utils/telemetry";
import { HiOutlineCubeTransparent } from "react-icons/hi2";

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

function GooeyPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const firstScreenRef = useRef(null);
  const navigate = useNavigate();

  usePageTitle("", "gooey");
  useFullscreen(); // Enable fullscreen with 'f' key

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
    sendTelemetry();
  }, []);

  // Add keyboard shortcuts
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
            className="min-h-[900vh] w-full relative bg-white dark:bg-black"
          >
            <CommandToolbar showKeyboardHelp={showKeyboardHelp} />
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

              <ExperienceSection
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

      {/* Floating Home Button */}
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
