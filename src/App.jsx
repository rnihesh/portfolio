import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import ThemeToggle from "./components/Theme/ThemeToggle";
import BlurText from "./TextAnimations/BlurText/BlurText";
import TextPressure from "./TextAnimations/TextPressure/TextPressure";
import DotGrid from "./Backgrounds/DotGrid/DotGrid";
import { motion, AnimatePresence } from "framer-motion";

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
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Reusable section component
const Section = ({ isVisible, children, animationProps, background }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center relative">
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

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [showThirdScreen, setShowThirdScreen] = useState(false);
  const [showFourthScreen, setShowFourthScreen] = useState(false);
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
    if (scrollPosition >= windowHeight * 2.7) {
      setShowFourthScreen(true);
    } else {
      setShowFourthScreen(false);
    }
  }, []);

  useEffect(() => {
    // Function to preload all images
    const preloadImages = async () => {
      const imagesToLoad = skills.map((skill) => skill.image);
      let loadedCount = 0;

      const allResources = [...imagesToLoad];
      const totalResources = allResources.length;

      // Reset loading progress at start
      setLoadingProgress(0);

      const loadPromises = allResources.map((url) => {
        return new Promise((resolve) => {
          if (
            url.endsWith(".svg") ||
            url.endsWith(".png") ||
            url.endsWith(".jpg") ||
            url.endsWith(".jpeg")
          ) {
            const img = new Image();
            img.src = url;
            img.onload = () => {
              loadedCount++;
              // Calculate percentage with Math.min to ensure it never exceeds 100
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
          } else {
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

    preloadImages();

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

  return (
    <div className="overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <LoadingAnimation key="loading" progress={loadingProgress} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-[400vh] w-full relative bg-white dark:bg-black"
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
                    className="text-9xl font-bold text-green-500"
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
                    className="w-full h-full"
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

                  <motion.div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ThemeToggle className="fixed top-4 right-4" />
    </div>
  );
}

export default App;
