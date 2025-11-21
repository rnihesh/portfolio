import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import useFullscreen from "../hooks/useFullscreen";
import MinimalSection from "../components/sections/MinimalSection";
import { sendTelemetry } from "../utils/telemetry";

function MinimalPage() {
  const navigate = useNavigate();
  usePageTitle("", "minimal");
  useFullscreen(); // Enable fullscreen with 'f' key
  
  useEffect(() => {
    sendTelemetry();
  }, []);

  const handleBackToChoice = () => {
    navigate("/");
  };

  return <MinimalSection onBackToChoice={handleBackToChoice} />;
}

export default MinimalPage;
