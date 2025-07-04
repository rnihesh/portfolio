import React from "react";
import { motion } from "framer-motion";

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

export default HalfUnderConstruction;
