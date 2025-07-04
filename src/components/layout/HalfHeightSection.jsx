import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const HalfHeightSection = ({
  id,
  isVisible,
  children,
  animationProps,
  background,
  className,
}) => {
  return (
    <div
      id={id}
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

export default HalfHeightSection;
