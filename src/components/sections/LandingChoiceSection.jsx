import React from "react";
import { motion } from "framer-motion";

function LandingChoiceSection({ onChoice }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
    hover: {
      scale: 1.05,
      rotateX: -5,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.9,
      rotateX: 5,
      y: 8,
      boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.1,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black bg-[url('/photography/m.jpeg')] bg-cover bg-center">
      <motion.div
        className="text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          variants={itemVariants}
        >
          Welcome
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
          variants={itemVariants}
        >
          Choose your preferred viewing experience
        </motion.p>

        <motion.div
          className="flex flex-col md:flex-row gap-8 items-center justify-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => onChoice("minimal")}
            className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:rounded-xl shadow-lg hover:shadow-xl"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              transformStyle: "preserve-3d",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            title="Navigate to /minimal"
          >
            MINIMAL
            <div className="text-sm mt-1 opacity-70">Clean & Simple</div>
          </motion.button>

          <motion.div
            className="text-gray-400 dark:text-gray-600"
            variants={itemVariants}
          >
            or
          </motion.div>

          <motion.button
            onClick={() => onChoice("gooey")}
            className="px-8 py-4 border-2 border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:rounded-xl shadow-lg hover:shadow-xl"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              transformStyle: "preserve-3d",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            title="Navigate to /gooey"
          >
            GOOEY
            <div className="text-sm mt-1 opacity-70">Full Experience</div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LandingChoiceSection;
