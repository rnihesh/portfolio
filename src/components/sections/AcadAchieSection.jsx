import React from "react";
import Section from "../layout/Section";
import { motion } from "framer-motion";

function AcadAchieSection({ id, isVisible, animationProps }) {
  // staggered animation for children
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
    <Section id={id} isVisible={isVisible} animationProps={animationProps}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center max-w-4xl"
      >
        <motion.h2
          variants={item}
          className="text-3xl md:text-6xl font-bold 
        bg-[linear-gradient(to_bottom,grey_50%,black_50%)] 
        dark:bg-[linear-gradient(to_bottom,white_50%,grey_50%)] 
        bg-clip-text text-transparent"
          style={{
            fontFamily: "Cascadia Code",
            fontWeight: "100 900",
            textAlign: "center",
          }}
        >
          <span className="border-2 border-black rounded dark:border-white border-dashed bg-gray-400 z-100 text-white dark:text-black inline-block transform rotate-[-45deg] mr-[-20px] md:mr-[-50px]">
            Work
          </span>{" "}
          Under Construction
        </motion.h2>
        <motion.div></motion.div>
      </motion.div>
    </Section>
  );
}

export default AcadAchieSection;
