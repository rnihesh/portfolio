import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";
import BlurText from "./TextAnimations/BlurText/BlurText";
import TextPressure from "./TextAnimations/TextPressure/TextPressure";
import DotGrid from "./Backgrounds/DotGrid/DotGrid";
import { motion, AnimatePresence } from "framer-motion";
import ModelViewer from "./components/ui/ModelViewer/ModelViewer";
import Masonry from "./components/ui/Masonry/Masonry";
import ExpandableCard from "./components/ui/ExpandableCards/ExpandableCards";
import { TypeWrite } from "./components/ui/TypeWrite/TypeWrite";
import { p } from "framer-motion/client";
import HandDrawnUnderline from "./components/my-creation/HandDrawnUnderline/HandDrawnUnderline";

// Enhanced loading animation with theme-aware colors
const LoadingAnimation = ({ progress = 0 }) => {
  const loadingContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const loadingDot = {
    hidden: { y: 0, opacity: 0 },
    show: {
      y: [0, -15, 0],
      opacity: 1,
      transition: {
        y: {
          repeat: Infinity,
          duration: 0.8,
          ease: "easeInOut",
        },
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6"
        variants={loadingContainer}
        initial="hidden"
        animate="show"
      >
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={loadingDot}
              className="w-4 h-4 rounded-full bg-black dark:bg-white"
              style={{ animationDelay: `${i * 0.15}s` }}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center"
        >
          <BlurText
            text="Loading Portfolio"
            className="text-xl font-medium text-black dark:text-white"
            direction="top"
            animateBy="words"
            stepDuration={0.3}
          />
          {progress > 0 && (
            <>
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                <motion.div
                  className="h-full bg-black dark:bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs mt-2 text-gray-600 dark:text-gray-400"
              >
                Loading skills and 3D models...
              </motion.p>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Reusable section component
const Section = ({
  isVisible,
  children,
  animationProps,
  background,
  className,
}) => {
  return (
    <div
      className={`h-screen w-full flex items-center justify-center relative ${className}`}
    >
      {background && <div className="absolute inset-0 z-0">{background}</div>}
      <div className="z-10 relative">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={animationProps.key}
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={animationProps.transition}
              className="flex items-center justify-center h-64 w-[80vw] md:h-96 md:w-[90vw] overflow"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// New HalfHeightSection component
const HalfHeightSection = ({
  isVisible,
  children,
  animationProps,
  background,
  className,
}) => {
  return (
    <div
      className={`h-[50vh] w-full flex items-center justify-center relative overflow-hidden ${className}`}
    >
      {background && <div className="absolute inset-0 z-0">{background}</div>}
      <div className="z-10 relative">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={animationProps.key}
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={animationProps.transition}
              className="flex items-center justify-center h-64 w-[80vw] md:h-96 md:w-[90vw]"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const HalfUnderConstruction = ({ isVisible, animationProps, className }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };
  return (
    <HalfHeightSection
      isVisible={isVisible}
      animationProps={animationProps}
      className="border-2 border-amber-50 border-dashed  overflow-visible"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-row items-center flex-wrap justify-center"
      >
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white border-2 border-black dark:border-white
                    px-[20vw] py-[10vh] rounded-2xl border-dotted"
          style={{ fontFamily: "monospace" }}
        >
          Under Construction
        </motion.h2>
      </motion.div>
    </HalfHeightSection>
  );
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [showThirdScreen, setShowThirdScreen] = useState(false);
  const [showFourthScreen, setShowFourthScreen] = useState(false);
  const [showFifthScreen, setShowFifthScreen] = useState(false);
  const [showSixthScreen, setShowSixthScreen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const firstScreenRef = useRef(null);
  // Skills data with images
  // Update the skills array with all your technologies
  const skills = [
    // Frontend
    {
      name: "React.js",
      image: "/images/react.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },
    {
      name: "HTML5",
      image: "/images/HTML5.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },
    {
      name: "CSS3",
      image: "/images/css3.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },
    {
      name: "JavaScript",
      image: "/images/javascript.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },
    {
      name: "Bootstrap",
      image: "/images/bootstrap.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },
    {
      name: "Tailwind CSS",
      image: "/images/tailwindcss.svg",
      font: "'Cascadia Code', monospace",
      category: "Frontend",
    },

    // Backend
    {
      name: "Node.js",
      image: "/images/nodejs.svg",
      font: "'Cascadia Code', monospace",
      category: "Backend",
    },
    {
      name: "Express.js",
      image: "/images/express.png",
      font: "'Cascadia Code', monospace",
      category: "Backend",
    },

    // Database
    {
      name: "MongoDB",
      image: "/images/mongodb.svg",
      font: "'Cascadia Code', monospace",
      category: "Database",
    },
    {
      name: "MySQL",
      image: "/images/mysql.png",
      font: "'Cascadia Code', monospace",
      category: "Database",
    },
    {
      name: "SQLite",
      image: "/images/sqlite.svg",
      font: "'Cascadia Code', monospace",
      category: "Database",
    },
    {
      name: "Firebase",
      image: "/images/firebase.svg",
      font: "'Cascadia Code', monospace",
      category: "Database",
    },

    // Other Tools
    {
      name: "Git",
      image: "/images/git.svg",
      font: "'Cascadia Code', monospace",
      category: "Tools",
    },
    {
      name: "AWS",
      image: "/images/aws.svg",
      font: "'Cascadia Code', monospace",
      category: "Cloud",
    },
    {
      name: "Vercel",
      image: "/images/vercel.svg",
      font: "'Cascadia Code', monospace",
      category: "Deployment",
    },
  ];

  const items = [
    {
      id: "1",
      img: "/photography/1.JPG",
      url: "https://vsco.co/niheshr/",
      height: 750,
    },
    {
      id: "2",
      img: "/photography/2.JPG",
      url: "https://vsco.co/niheshr/",
      height: 120,
    },
    {
      id: "3",
      img: "/photography/3.PNG",
      url: "https://vsco.co/niheshr/",
      height: 300,
    },
    {
      id: "4",
      img: "/photography/4.JPG",
      url: "https://vsco.co/niheshr/",
      height: 200,
    },
    {
      id: "5",
      img: "/photography/5.JPG",
      url: "https://vsco.co/niheshr/",
      height: 90,
    },
    {
      id: "6",
      img: "/photography/6.JPG",
      url: "https://vsco.co/niheshr/",
      height: 600,
    },
    {
      id: "7",
      img: "/photography/7.JPG",
      url: "https://vsco.co/niheshr/",
      height: 500,
    },
    {
      id: "8",
      img: "/photography/8.JPG",
      url: "https://vsco.co/niheshr/",
      height: 400,
    },
    {
      id: "9",
      img: "/photography/9.JPG",
      url: "https://vsco.co/niheshr/",
      height: 400,
    },
  ];

  const words = [
    {
      text: "My",
      className: "text-black-500",
    },
    {
      text: "Projects ",
      className: "text-black-500",
    },
  ];

  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    // First screen visibility
    if (scrollPosition <= windowHeight * 0.3) {
      setShowFirstScreen(true);
    } else {
      setShowFirstScreen(false);
    }

    // Second screen visibility
    if (
      scrollPosition >= windowHeight * 0.7 &&
      scrollPosition <= windowHeight * 1.3
    ) {
      setShowSecondScreen(true);
    } else {
      setShowSecondScreen(false);
    }

    // Third screen visibility
    if (
      scrollPosition >= windowHeight * 1.7 &&
      scrollPosition <= windowHeight * 2.3
    ) {
      setShowThirdScreen(true);
    } else {
      setShowThirdScreen(false);
    }

    // Fourth screen visibility
    if (
      scrollPosition >= windowHeight * 2.7 &&
      scrollPosition <= windowHeight * 3.3
    ) {
      setShowFourthScreen(true);
    } else {
      setShowFourthScreen(false);
    }

    // Fifth screen visibility
    if (scrollPosition >= windowHeight * 3.3) {
      setShowFifthScreen(true);
    } else {
      setShowFifthScreen(false);
    }

    if (scrollPosition >= windowHeight * 4.7) {
      setShowSixthScreen(true);
    } else {
      setShowSixthScreen(false);
    }
  }, []);

  useEffect(() => {
    // Function to preload all images and 3D model
    const preloadResources = async () => {
      const imagesToLoad = skills.map((skill) => skill.image);
      const modelUrl = "/3d_models/plane.glb";
      let loadedCount = 0;

      const allResources = [...imagesToLoad, modelUrl];
      const totalResources = allResources.length;

      // Reset loading progress at start
      setLoadingProgress(0);

      const loadPromises = allResources.map((url) => {
        return new Promise((resolve) => {
          if (
            url.endsWith(".svg") ||
            url.endsWith(".png") ||
            url.endsWith(".jpg") ||
            url.endsWith(".jpeg") ||
            url.endsWith(".JPG")
          ) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              loadedCount++;
              const percentage = Math.min(
                Math.round((loadedCount / totalResources) * 100),
                100
              );
              setLoadingProgress(percentage);
              resolve();
            };
            img.onerror = () => {
              loadedCount++;
              const percentage = Math.min(
                Math.round((loadedCount / totalResources) * 100),
                100
              );
              setLoadingProgress(percentage);
              resolve();
            };
          }
          // else if (url.endsWith(".glb")) {
          //   // Preload 3D model
          //   import("three/examples/jsm/loaders/GLTFLoader")
          //     .then(({ GLTFLoader }) => {
          //       const loader = new GLTFLoader();
          //       loader.load(
          //         url,
          //         () => {
          //           loadedCount++;
          //           const percentage = Math.min(
          //             Math.round((loadedCount / totalResources) * 100),
          //             100
          //           );
          //           setLoadingProgress(percentage);
          //           console.log("3D model preloaded successfully");
          //           resolve();
          //         },
          //         // Progress callback
          //         (xhr) => {
          //           const modelProgress = Math.floor(
          //             (xhr.loaded / xhr.total) * 100
          //           );
          //           console.log(`Model loading: ${modelProgress}%`);
          //         },
          //         // Error callback
          //         (error) => {
          //           console.error("Error loading 3D model:", error);
          //           loadedCount++;
          //           const percentage = Math.min(
          //             Math.round((loadedCount / totalResources) * 100),
          //             100
          //           );
          //           setLoadingProgress(percentage);
          //           resolve();
          //         }
          //       );
          //     })
          //     .catch((error) => {
          //       console.error("Error importing GLTFLoader:", error);
          //       loadedCount++;
          //       setLoadingProgress(
          //         Math.min(
          //           Math.round((loadedCount / totalResources) * 100),
          //           100
          //         )
          //       );
          //       resolve();
          //     });
          // }
          else {
            // Just resolve for other resource types
            setTimeout(() => {
              loadedCount++;
              const percentage = Math.min(
                Math.round((loadedCount / totalResources) * 100),
                100
              );
              setLoadingProgress(percentage);
              resolve();
            }, 100);
          }
        });
      });

      try {
        await Promise.all(loadPromises);

        // Ensure we reach 100% before transitioning
        setLoadingProgress(100);

        // Small delay after reaching 100%
        setTimeout(() => {
          setIsLoaded(true);
        }, 800);
      } catch (error) {
        console.error("Error loading resources:", error);
        setLoadingProgress(100);
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      }
    };

    preloadResources(); // Changed from preloadImages to preloadResources

    // Throttled scroll handler for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [handleScroll, skills]);

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

  const SixthScreenAnimation = {
    key: "fifth-screen",
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.8 },
  };

  // Staggered animation for children elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  const skillItem = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
    },
  };

  const cards = [
    {
      description: "A Blog App",
      title: "Logly",
      src: "/projects/logly.jpeg",
      ctaText: "Visit",
      ctaLink: "https://logly.vercel.app/",
      github: "https://github.com/rnihesh/logly/",
      logo: "/projects/logos/logly.svg",
      content: () => {
        return (
          <>
            <p>
              Logly is a MERN-stack powered blogging platform with clerk,
              role-based access, and responsive design — built for seamless
              writing, sharing, and content management.
            </p>
            <div className="flex g-2 flex-wrap overflow-ellipsis">
              {[
                "ReactJS",
                "NodeJs",
                "Bootstrap",
                "Express",
                "MongoDB",
                "Auth",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      description: "A Vehicle Pooling App",
      title: "RideShare",
      src: "/projects/rideshare.jpeg",
      ctaText: "Visit",
      ctaLink: "https://nihesh-ride-share.vercel.app/",
      github: "https://github.com/rnihesh/car_pooling/",
      logo: "/projects/logos/rideshare.png",
      content: () => {
        return (
          <>
            <p>
              A MERN-based vehicle pooling app using MongoDB aggregation
              pipelines and geo-coordinates for efficient driver-passenger
              matching, location-based queries, with secure authentication with
              clerk.
            </p>
            <div className="flex g-2 flex-wrap overflow-ellipsis">
              {[
                "ReactJS",
                "NodeJs",
                "MongoDB",
                "Aggregation Pipelines",
                "Leaflet",
                "Bootstrap",
                "Express",
                "Auth",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        );
      },
    },

    {
      description: "A Gamified Habit Tracker",
      title: "Habify",
      src: "/projects/habify.jpeg",
      ctaText: "Visit",
      ctaLink: "https://habify-red.vercel.app/",
      github: "https://github.com/rnihesh/gamified_habit_tracker/",
      logo: "/projects/logos/habify.webp",
      content: () => {
        return (
          <>
            <p>
              HabiFy is a gamified habit tracker built with MERN stack, using
              MongoDB for progress tracking, dynamic scoring, level systems, and
              responsive dashboards & leaderboards with secure user auth and
              role control.
            </p>
            <div className="flex g-2 flex-wrap overflow-ellipsis">
              {[
                "ReactJS",
                "NodeJs",
                "Cron",
                "MongoDB",
                "Bootstrap",
                "Express",
                "Auth",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      description: "A Modern Seller Portal",
      title: "Nihesh's Seller Portal",
      src: "/projects/nihesh_s_seller_portal.jpeg",
      ctaText: "Visit",
      ctaLink: "https://nihesh-seller-portal.vercel.app/",
      github: "https://github.com/rnihesh/nihesh-s-seller-portal/",
      logo: "/projects/logos/nihesh_s_seller_portal.png",
      content: () => {
        return (
          <>
            <p>
              A MERN stack app, integrated with Cloudinary for media management
              and Gemini AI for smart content generation, enabling seamless
              product uploads, edits, and seller analytics.
            </p>
            <div className="flex g-2 flex-wrap overflow-ellipsis">
              {[
                "ReactJS",
                "NodeJs",
                "MongoDB",
                "Bootstrap",
                "Gemini AI",
                "Cloudinary",
                "Express",
                "Auth",
              ].map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                  style={{ fontFamily: "JetBrains Mono" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        );
      },
    },
    {
      description: "A WebSocket Example",
      title: "Live Cursors",
      src: "/projects/live_cursors.jpeg",
      ctaText: "Visit",
      ctaLink: "https://nihesh-cursors.vercel.app/",
      github: "https://github.com/rnihesh/live-cursors-app/",
      logo: "/projects/logos/cursor.png",
      logoClassName: "dark:invert",
      content: () => {
        return (
          <>
            <p>
              A real-time collaborative web app using WebSockets where users
              join with a name and see each other's cursor movements live,
              enabling shared interaction through minimal input and seamless
              syncing.
            </p>
            <div className="flex g-2 flex-wrap overflow-ellipsis">
              {["ReactJS", "NodeJs", "WebSockets", "Express", "ws"].map(
                (skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 mr-1 mb-2"
                    style={{ fontFamily: "JetBrains Mono" }}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </>
        );
      },
    },
  ];

  // useEffect(() => {
  //   // Only preload the model if it hasn't been loaded yet
  //   if (!modelLoaded) {
  //     import("three/examples/jsm/loaders/GLTFLoader").then(({ GLTFLoader }) => {
  //       const loader = new GLTFLoader();
  //       loader.load(
  //         "/3d_models/plane.glb",
  //         () => {
  //           console.log("3D model preloaded successfully");
  //           setModelLoaded(true);
  //         },
  //         null,
  //         (error) => console.error("Error loading 3D model:", error)
  //       );
  //     });
  //   }
  // }, [modelLoaded]);

  return (
    <div className="overflow-x-hidden scrollbar-hide">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <LoadingAnimation key="loading" progress={loadingProgress} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-[600vh] w-full relative bg-white dark:bg-black"
          >
            <div className="absolute inset-0 flex flex-col items-center">
              <Section
                ref={firstScreenRef}
                isVisible={showFirstScreen}
                animationProps={firstScreenAnimation}
              >
                <div className="flex gap-4 items-center flex-wrap">
                  <BlurText
                    text="Hi,"
                    className="text-9xl font-bold text-black dark:text-white"
                    direction="top"
                    animateBy="words"
                    stepDuration={0.5}
                  />
                  <BlurText
                    text="Peep"
                    className="text-9xl font-bold text-green-500 italic"
                    direction="top"
                    animateBy="words"
                    stepDuration={1}
                  />
                </div>
              </Section>

              <Section
                isVisible={showSecondScreen}
                animationProps={secondScreenAnimation}
              >
                <TextPressure
                  text="I'm ‎  Nihesh"
                  fontFamily="Figtree"
                  flex={true}
                  weight={true}
                  width={true}
                  italic={true}
                  className="text-black dark:text-white"
                />
              </Section>

              <Section
                isVisible={showThirdScreen}
                animationProps={thirdScreenAnimation}
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center max-w-3xl text-center"
                >
                  <motion.h2
                    variants={item}
                    className="text-4xl md:text-5xl font-bold mb-6 text-black dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Full Stack Developer
                  </motion.h2>

                  <motion.p
                    variants={item}
                    className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: "'IBM Plex Mono', serif" }}
                  >
                    With a strong eye for design and detail, I build modern web
                    applications that are not only functional but also intuitive
                    and visually clean.
                  </motion.p>
                </motion.div>
              </Section>

              <Section
                isVisible={showFourthScreen}
                animationProps={fourthScreenAnimation}
                background={
                  <DotGrid
                    dotSize={4}
                    gap={32}
                    baseColor="#adacac"
                    activeColor="#10b981"
                    proximity={150}
                    className="w-full h-full overflow-hidden"
                  />
                }
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center max-w-4xl"
                >
                  <motion.h2
                    variants={item}
                    className="text-4xl md:text-5xl font-bold mb-10 text-black dark:text-white"
                    style={{ fontFamily: "'Red Rose', cursive" }}
                  >
                    My Skills
                  </motion.h2>

                  <motion.div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-full">
                    {skills.map((skill) => (
                      <motion.div
                        key={skill.name}
                        variants={skillItem}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-50 rounded-xl p-2 flex items-center justify-center mb-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <img
                            src={skill.image}
                            alt={skill.name}
                            className="w-10 h-10 md:w-12 md:h-12 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/100x100/10b981/ffffff?text=${skill.name[0]}`;
                            }}
                          />
                        </div>
                        <p
                          className="text-xs md:text-sm font-medium text-black dark:text-white text-center"
                          style={{ fontFamily: "'Cascadia Code', monospace" }}
                        >
                          {skill.name}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </Section>

              <HalfHeightSection
                isVisible={showFifthScreen}
                animationProps={fifthScreenAnimation}
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-row items-center flex-wrap justify-center overflow-hidden"
                >
                  <motion.h2
                    variants={item}
                    className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Bold by Design
                  </motion.h2>

                  <ModelViewer
                    url="/3d_models/plane.glb"
                    width={800}
                    height={300}
                    enableMouseParallax={false}
                    enableManualRotation={false}
                    enableHoverRotation={false}
                    fadeIn={false}
                    environmentPreset="sunset"
                    keyLightIntensity={2.0}
                    placeholderSrc="nihesh.png"
                    defaultRotationX={-20.8} // Updated from 32.1 to match new degY value
                    defaultRotationY={10.8} // Updated from 27.4 to match new degX value
                    defaultZoom={2}
                    cacheKey="planeModel"
                    onModelLoaded={() =>
                      console.log("Model loaded successfully")
                    }
                  />
                </motion.div>
              </HalfHeightSection>
              {/* {
                <HalfUnderConstruction
                  isVisible={showFifthScreen}
                  animationProps={fifthScreenAnimation}
                  className=""
                />
              } */}

              <HalfHeightSection
                isVisible={showFifthScreen}
                animationProps={fifthScreenAnimation}
                className=""
              >
                {/* <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-row items-center flex-wrap justify-center "
                > */}
                <Masonry
                  items={items}
                  ease="power3.out"
                  duration={0.6}
                  stagger={0.05}
                  animateFrom="bottom"
                  scaleOnHover={true}
                  hoverScale={0.95}
                  blurToFocus={true}
                  colorShiftOnHover={false}
                />
                {/* </motion.div> */}
              </HalfHeightSection>

              <Section
                isVisible={showSixthScreen}
                animationProps={SixthScreenAnimation}
                className="overflow-hidden relative" // Added overflow-hidden
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center w-full"
                >
                  <div
                    className="sticky top-0 w-full h-[20vh] flex items-center justify-center bg-white dark:bg-black z-[9]"
                    style={{
                      position: "sticky",
                      top: 0,
                    }}
                  >
                    <HandDrawnUnderline
                      strokeColor="#27ae60"
                      strokeWidth={1.5}
                      wobbleIntensityX={0.2}
                      wobbleIntensityY={1.5}
                      // segmentLength={15}
                      style={{
                        fontSize: "2em",
                        fontWeight: "normal",
                        color: "#34495e",
                      }}
                    >
                      <TypeWrite words={words} />
                    </HandDrawnUnderline>
                  </div>

                  <div
                    className="h-[80vh] w-full overflow-y-scroll scrollbar-hide"
                    style={{
                      scrollBehavior: "smooth",
                      WebkitOverflowScrolling: "touch",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                  >
                    <ExpandableCard cards={cards} />
                  </div>
                </motion.div>
              </Section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeToggle className="fixed top-4 right-4" />
    </div>
  );
}

export default App;
