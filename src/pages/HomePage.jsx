import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import useFullscreen from "../hooks/useFullscreen";
import LandingChoiceSection from "../components/sections/LandingChoiceSection";
import { sendTelemetry } from "../utils/telemetry";

function HomePage() {
  const navigate = useNavigate();
  usePageTitle("", "home");
  useFullscreen(); // Enable fullscreen with 'f' key
  
  useEffect(() => {
    sendTelemetry();
  }, []);

  const handleChoice = (choice) => {
    if (choice === "minimal") {
      navigate("/minimal");
    } else if (choice === "gooey") {
      navigate("/gooey");
    }
  };

  return <LandingChoiceSection onChoice={handleChoice} />;
}

export default HomePage;
