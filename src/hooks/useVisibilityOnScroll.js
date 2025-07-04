import { useCallback, useEffect, useState } from "react";

export default function useVisibilityOnScroll() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [showThirdScreen, setShowThirdScreen] = useState(false);
  const [showFourthScreen, setShowFourthScreen] = useState(false);
  const [showFifthScreen, setShowFifthScreen] = useState(false);
  const [showSixthScreen, setShowSixthScreen] = useState(false);
  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    // First screen visibility
    if (scrollPosition <= windowHeight * 0.3) {
      setShowFirstScreen(true);
    } else {
      setShowFirstScreen(false);
    }

    // Second screen visibility
    if (
      scrollPosition >= windowHeight * 0.7 &&
      scrollPosition <= windowHeight * 1.3
    ) {
      setShowSecondScreen(true);
    } else {
      setShowSecondScreen(false);
    }

    // Third screen visibility
    if (
      scrollPosition >= windowHeight * 1.7 &&
      scrollPosition <= windowHeight * 2.3
    ) {
      setShowThirdScreen(true);
    } else {
      setShowThirdScreen(false);
    }

    // Fourth screen visibility
    if (
      scrollPosition >= windowHeight * 2.7 &&
      scrollPosition <= windowHeight * 3.3
    ) {
      setShowFourthScreen(true);
    } else {
      setShowFourthScreen(false);
    }

    // Fifth screen visibility
    if (scrollPosition >= windowHeight * 3.3) {
      setShowFifthScreen(true);
    } else {
      setShowFifthScreen(false);
    }

    if (scrollPosition >= windowHeight * 4.7) {
      setShowSixthScreen(true);
    } else {
      setShowSixthScreen(false);
    }
  }, []);

  useEffect(() => {
    // throttled scroll handler for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    return () => window.removeEventListener("scroll", scrollListener);
  }, [handleScroll]);

  return {
    showFirstScreen,
    showSecondScreen,
    showThirdScreen,
    showFourthScreen,
    showFifthScreen,
    showSixthScreen,
  };
}
