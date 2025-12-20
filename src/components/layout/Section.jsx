import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../common/GlassCard";

const Section = ({
  id,
  isVisible,
  children,
  animationProps,
  background,
  className,
  innerClassName,
  back_class,
  modern = false,
}) => {
  if (modern) {
    return (
      <div
        id={id}
        className={`min-h-screen w-full flex items-center justify-center relative py-20 ${className || ""}`}
      >
        {background && (
          <div className={`absolute inset-0 z-0 ${back_class || ""}`}>
            {background}
          </div>
        )}
        <div className="z-10 relative w-full flex justify-center">
          <motion.div
            initial={animationProps?.initial || { opacity: 0, y: 50 }}
            whileInView={animationProps?.animate || { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={animationProps?.transition || { duration: 0.8 }}
            className={`flex items-center justify-center w-[90vw] md:w-[80vw] ${innerClassName || ""}`}
          >
            <GlassCard className="p-8 md:p-12 w-full">
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
      className={`h-screen w-full flex items-center justify-center relative ${className}`}
    >
      {background && (
        <div className={`absolute inset-0 z-0 ${back_class}`}>{background}</div>
      )}
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
