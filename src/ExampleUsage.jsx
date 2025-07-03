import React from "react";
import HandDrawnUnderline from "./components/my-creation/HandDrawnUnderline/HandDrawnUnderline";

const ExampleUsage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        backgroundColor: "#f0f0f0",
        gap: "2rem",
      }}
    >
      {/* Basic usage */}
      <HandDrawnUnderline
        style={{
          fontSize: "3.5em",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        Hand-Drawn SVG Clarity!
      </HandDrawnUnderline>

      {/* Custom styling */}
      <HandDrawnUnderline
        strokeColor="#ff6b6b"
        strokeWidth={3}
        wobbleIntensityX={1}
        wobbleIntensityY={4}
        style={{
          fontSize: "2.5em",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Custom Red Underline
      </HandDrawnUnderline>

      {/* Subtle underline */}
      <HandDrawnUnderline
        strokeColor="#27ae60"
        strokeWidth={1.5}
        wobbleIntensityX={0.2}
        wobbleIntensityY={1.5}
        segmentLength={15}
        style={{
          fontSize: "2em",
          fontWeight: "normal",
          color: "#34495e",
        }}
      >
        Subtle Green Underline
      </HandDrawnUnderline>

      {/* Wild and sketchy */}
      <HandDrawnUnderline
        strokeColor="#9b59b6"
        strokeWidth={4}
        wobbleIntensityX={2}
        wobbleIntensityY={6}
        segmentLength={8}
        lineBottomOffset={12}
        style={{
          fontSize: "3em",
          fontWeight: "bold",
          color: "#8e44ad",
        }}
      >
        Wild Purple Sketch!
      </HandDrawnUnderline>
    </div>
  );
};

export default ExampleUsage;
