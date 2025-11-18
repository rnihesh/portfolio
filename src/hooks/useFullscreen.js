import { useEffect, useCallback } from "react";

/**
 * Custom hook to enable fullscreen toggle with 'f' key
 * Similar to YouTube's fullscreen behavior
 */
function useFullscreen() {
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(
          `Error attempting to enable fullscreen: ${err.message} (${err.name})`
        );
      });
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if 'f' key is pressed (not in input fields)
      if (
        e.key.toLowerCase() === "f" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        const target = e.target;
        // Prevent triggering in input, textarea, or contenteditable elements
        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleFullscreen]);

  return { toggleFullscreen };
}

export default useFullscreen;
