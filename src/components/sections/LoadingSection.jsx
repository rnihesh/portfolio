import React from "react";

const LoadingSection = ({ progress = 0 }) => {
  // Simple CSS-only loading animation
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-black z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Simple CSS-only bouncing dots */}
        <div className="flex space-x-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full bg-black dark:bg-white animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "0.8s",
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center">
          {/* Simple static text instead of animated BlurText */}
          <div className="text-xl font-medium text-black dark:text-white">
            Loading Portfolio
          </div>

          {progress > 0 && (
            <>
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-4 overflow-hidden">
                {/* Simple progress bar with inline styles */}
                <div
                  className="h-full bg-black dark:bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Loading skills and 3D models...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSection;
