import React from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import BlurText from "../../TextAnimations/BlurText/BlurText";

function IntroSection({ isVisible, animationProps }) {
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
    <Section
      // ref={firstScreenRef}
      isVisible={isVisible}
      animationProps={animationProps}
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
  );
}

export default IntroSection;
