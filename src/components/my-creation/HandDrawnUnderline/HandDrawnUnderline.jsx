import React, { useEffect, useRef, useState, useCallback } from "react";

const HandDrawnUnderline = ({
  children,
  strokeColor = "#007bff",
  strokeWidth = 2.5,
  wobbleIntensityX = 0.5,
  wobbleIntensityY = 3,
  segmentLength = 10,
  lineBottomOffset = 8,
  className = "",
  style = {},
}) => {
  const textRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [pathData, setPathData] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  const generateHandDrawnPath = useCallback(() => {
    if (!textRef.current || !containerRef.current) return;

    const textRect = textRef.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(textRef.current);

    // Create temporary canvas to measure text metrics
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    const textMetrics = tempCtx.measureText(textRef.current.textContent);

    // Calculate SVG dimensions
    const svgWidth = textRect.width;
    const svgHeight =
      textRect.height + lineBottomOffset + wobbleIntensityY * 2 + strokeWidth;

    setSvgDimensions({ width: svgWidth, height: svgHeight });

    // Generate points for the sketchy line
    const linePoints = [];
    const startY = textRect.height + lineBottomOffset + wobbleIntensityY;
    const startX = 0;
    const endX = svgWidth;

    for (let x = startX; x <= endX; x += segmentLength) {
      const wobbleX = (Math.random() - 0.5) * wobbleIntensityX * 2;
      const wobbleY = (Math.random() - 0.5) * wobbleIntensityY * 2;

      linePoints.push({ x: x + wobbleX, y: startY + wobbleY });
    }

    // Construct SVG Path 'd' attribute string
    let pathString = "";
    if (linePoints.length > 0) {
      pathString = `M ${linePoints[0].x},${linePoints[0].y}`;
      for (let i = 1; i < linePoints.length; i++) {
        pathString += ` L ${linePoints[i].x},${linePoints[i].y}`;
      }
    }

    setPathData(pathString);
    setIsInitialized(true);
  }, [
    wobbleIntensityX,
    wobbleIntensityY,
    segmentLength,
    lineBottomOffset,
    strokeWidth,
  ]);

  // Initial generation and resize handling
  useEffect(() => {
    const timer = setTimeout(() => {
      generateHandDrawnPath();
    }, 10);

    const handleResize = () => {
      if (isInitialized) {
        generateHandDrawnPath();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [generateHandDrawnPath, isInitialized]);

  // Handle children changes with debouncing
  useEffect(() => {
    if (!isInitialized) return;

    const timer = setTimeout(() => {
      generateHandDrawnPath();
    }, 50); // Slightly longer delay for children changes

    return () => clearTimeout(timer);
  }, [children, generateHandDrawnPath, isInitialized]);

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    paddingBottom: "5px",
    ...style,
  };

  const textStyle = {
    position: "relative",
    zIndex: 1,
  };

  const svgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: `${svgDimensions.width}px`,
    height: `${svgDimensions.height}px`,
    pointerEvents: "none",
    zIndex: 0,
    overflow: "visible",
  };

  const pathStyle = {
    fill: "none",
    stroke: strokeColor,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <div
      ref={containerRef}
      className={`hand-drawn-underline ${className}`}
      style={containerStyle}
    >
      <span ref={textRef} style={textStyle}>
        {children}
      </span>
      <svg
        ref={svgRef}
        style={svgStyle}
        width={svgDimensions.width}
        height={svgDimensions.height}
      >
        <path d={pathData} style={pathStyle} />
      </svg>
    </div>
  );
};

export default HandDrawnUnderline;
