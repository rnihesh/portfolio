import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GlassCard = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-lg",
        hoverEffect &&
          "transition-all duration-300 hover:bg-white/20 dark:hover:bg-black/20 hover:scale-[1.02] hover:shadow-xl",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
