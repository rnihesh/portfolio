import React from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import TextPressure from "../../TextAnimations/TextPressure/TextPressure"

function NameSection({ isVisible, animationProps }) {
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
      isVisible={isVisible}
      animationProps={animationProps}
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
  );
}

export default NameSection;
