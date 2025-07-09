import React from "react";
import { motion } from "framer-motion";
import HalfHeightSection from "../layout/HalfHeightSection";
import ModelViewer from "../ui/ModelViewer/ModelViewer";
import { models } from "../../data/models";
import { isResourceLoaded } from "../../utils/resourcePreloader";

function ModelSection({ id, isVisible, animationProps }) {
  // Get the current model to display
  const currentModel = models.plane; // You can change this to any model in your config

  // Check if model is already loaded
  const modelIsPreloaded = isResourceLoaded(currentModel.url);

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
    <HalfHeightSection
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-row items-center flex-wrap justify-center overflow-hidden"
      >
        <motion.h2
          variants={item}
          className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Bold by Design
        </motion.h2>

        <ModelViewer
          url={currentModel.url}
          width={500}
          height={300}
          enableMouseParallax={false}
          enableManualRotation={false}
          enableHoverRotation={false}
          enableDirectModelControl={true} // Add this new prop
          disableOrbitControls={true}
          minZoomDistance={0.00000005}
          maxZoomDistance={10}
          fadeIn={false}
          environmentPreset="sunset"
          keyLightIntensity={2.0}
          placeholderSrc="nihesh.png"
          defaultRotationX={currentModel.defaultRotationX}
          defaultRotationY={currentModel.defaultRotationY}
          defaultZoom={currentModel.defaultZoom || 0.25}
          cacheKey={currentModel.url}
          isPreloaded={modelIsPreloaded}
          onModelLoaded={() => console.log("Model loaded successfully")}
        />
      </motion.div>
    </HalfHeightSection>
  );
}

export default ModelSection;
