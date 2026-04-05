import { useEffect } from "react";
import { useWebHaptics } from "web-haptics/react";

/**
 * Wrapper around web-haptics for consistent haptic feedback across the portfolio.
 *
 * Presets: "selection" | "light" | "soft" | "medium" | "heavy" | "rigid"
 *        | "success" | "warning" | "error" | "nudge" | "buzz"
 */
export function useHaptics() {
  const { trigger, cancel, isSupported } = useWebHaptics();
  return { trigger, cancel, isSupported };
}


/**
 * Adds a light haptic pulse on every touch start within the given ref (or document).
 * Useful for a global "tap feedback" feel.
 */
export function useTapHaptics() {
  const { trigger } = useHaptics();

  useEffect(() => {
    const onTouch = (e) => {
      const tag = e.target.tagName;
      // Only fire on interactive-ish elements or general taps, skip canvas
      if (tag === "CANVAS") return;
      trigger("light");
    };

    document.addEventListener("touchstart", onTouch, { passive: true });
    return () => document.removeEventListener("touchstart", onTouch);
  }, [trigger]);
}
