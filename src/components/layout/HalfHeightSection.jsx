import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../common/GlassCard";

const HalfHeightSection = ({
  id,
  isVisible,
  children,
  animationProps,
  background,
  className,
  modern = false,
}) => {
  if (modern) {
    return (
      <div
        id={id}
        className={`min-h-[50vh] w-full flex items-center justify-center relative py-10 ${className || ""}`}
      >
        {background && <div className="absolute inset-0 z-0">{background}</div>}
        <div className="z-10 relative w-full flex justify-center">
          <motion.div
            initial={animationProps?.initial || { opacity: 0, y: 30 }}
            whileInView={animationProps?.animate || { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={animationProps?.transition || { duration: 0.8 }}
            className="flex items-center justify-center w-[90vw] md:w-[80vw]"
          >
            <GlassCard className="p-6 md:p-8 w-full flex justify-center items-center">
              {children}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    );
  }

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
