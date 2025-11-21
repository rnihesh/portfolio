/**
 * Send telemetry data to analytics endpoint
 * Only sends in production environment
 */
export const sendTelemetry = async () => {
  if (import.meta.env.MODE !== "production") {
    return;
  }

  try {
    const conn = navigator.connection || {};
    const hasBatteryAPI = "getBattery" in navigator;
    let bat = { level: null, charging: null };

    if (hasBatteryAPI) {
      try {
        const battery = await navigator.getBattery();
        bat.level = battery.level;
        bat.charging = battery.charging;
      } catch (e) {
        // Battery API not available or permission denied
      }
    }

    const payload = {
      url: location.href,
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      referrer: document.referrer,
      viewport: `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: conn.effectiveType,
      downlink: conn.downlink,
      rtt: conn.rtt,
      touchSupport: "ontouchstart" in window,
      orientation: screen.orientation?.type,
      batteryLevel: bat.level,
      charging: bat.charging,
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      pageTitle: document.title,
      timestamp: new Date().toISOString(),
    };

    await fetch("https://traana.vercel.app/tra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Silently fail - telemetry should not break the app
    console.debug("Telemetry failed:", error);
  }
};
