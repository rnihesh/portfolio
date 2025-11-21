import React from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";

function WhatAmISection({id, isVisible, animationProps }) {
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
          applications that are not only functional but also intuitive and
          visually clean.
        </motion.p>
      </motion.div>
    </Section>
  );
}

export default WhatAmISection;
