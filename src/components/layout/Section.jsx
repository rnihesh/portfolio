import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Section = ({
  id,
  isVisible,
  children,
  animationProps,
  background,
  className,
  innerClassName,
  back_class
}) => {
  return (
    <div
      id={id}
      className={`h-screen w-full flex items-center justify-center relative ${className}`}
    >
      {background && <div className={`absolute inset-0 z-0 ${back_class}`}>{background}</div>}
      <div className="z-10 relative">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={animationProps.key}
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={animationProps.transition}
              className={`flex items-center justify-center h-full w-[80vw] md:w-[90vw] overflow ${innerClassName}`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Section;
