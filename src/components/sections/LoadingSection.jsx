import React from 'react'
import {motion} from "framer-motion"
import BlurText from '../../TextAnimations/BlurText/BlurText'

const LoadingSection = ({ progress = 0 }) => {
  // staggered animation for children
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

export default LoadingSection