import { skills } from "../data/skills";
import { photoItems } from "../data/photos";
import { projects } from "../data/projects";
import { getAllModelUrls } from "../data/models";
import { useGLTF } from "@react-three/drei";

// Create a map to track which resources have been loaded
const loadedResources = new Map();

// Global flag to track if initial preloading is complete
let preloadingCompleteFlag = false;
let preloadingPromise = null;

export const preloadResources = async (setLoadingProgress, setIsLoaded) => {
  // If preloading is already complete, immediately set as loaded
  if (preloadingCompleteFlag) {
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return;
  }

  // If preloading is already in progress, wait for it
  if (preloadingPromise) {
    await preloadingPromise;
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return;
  }

  // Start new preloading
  preloadingPromise = performPreloading(setLoadingProgress, setIsLoaded);
  await preloadingPromise;
};

const performPreloading = async (setLoadingProgress, setIsLoaded) => {
  // Get all images to preload
  const skillImages = skills.map((skill) => skill.image);

  // Load ALL photo images during initial load
  const allPhotoImages = photoItems.map((item) => item.img);

  // Get project images (both main images and logos)
  const projectImages = projects.flatMap((project) => [
    project.src,
    ...(project.logo ? [project.logo] : []),
  ]);

  // Add GitHub mark logo to critical resources
  const githubLogo = "github/github-mark.svg";

  // Get model URLs from centralized config
  const modelUrls = getAllModelUrls();

  // Preload 3D models using Three.js's own preloading system
  modelUrls.forEach((url) => {
    if (url.endsWith(".glb") || url.endsWith(".gltf")) {
      useGLTF.preload(url);
      // Still mark as loaded in our map
      loadedResources.set(url, true);
    }
  });

  // Combine other resources to load
  const otherResources = [
    ...skillImages,
    ...allPhotoImages,
    ...projectImages,
    githubLogo, // Add GitHub logo here
  ];

  const totalResources = otherResources.length + modelUrls.length;
  let loadedCount = modelUrls.length; // Start with models already counted

  // Reset loading progress at start, accounting for models
  setLoadingProgress(Math.round((loadedCount / totalResources) * 100));

  // Rest of your loading code for images remains the same
  const loadPromises = otherResources.map((url) => {
    // Skip if already loaded
    if (loadedResources.has(url)) {
      loadedCount++;
      const percentage = Math.min(
        Math.round((loadedCount / totalResources) * 100),
        100
      );
      setLoadingProgress(percentage);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (
        url.endsWith(".svg") ||
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg") ||
        url.endsWith(".JPG") ||
        url.endsWith(".PNG") ||
        url.endsWith(".webp")
      ) {
        // Use link preload for better browser caching
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;

        link.onload = () => {
          loadedCount++;
          loadedResources.set(url, true);
          const percentage = Math.min(
            Math.round((loadedCount / totalResources) * 100),
            100
          );
          setLoadingProgress(percentage);
          resolve();
        };

        link.onerror = () => {
          loadedCount++;
          const percentage = Math.min(
            Math.round((loadedCount / totalResources) * 100),
            100
          );
          setLoadingProgress(percentage);
          resolve();
        };

        document.head.appendChild(link);
      } else if (url.endsWith(".glb")) {
        // For 3D models, use fetch to preload
        fetch(url)
          .then(() => {
            loadedResources.set(url, true);
            loadedCount++;
            const percentage = Math.min(
              Math.round((loadedCount / totalResources) * 100),
              100
            );
            setLoadingProgress(percentage);
            resolve();
          })
          .catch(() => {
            loadedCount++;
            const percentage = Math.min(
              Math.round((loadedCount / totalResources) * 100),
              100
            );
            setLoadingProgress(percentage);
            resolve();
          });
      } else {
        // Just resolve for other resource types
        setTimeout(() => {
          loadedCount++;
          const percentage = Math.min(
            Math.round((loadedCount / totalResources) * 100),
            100
          );
          setLoadingProgress(percentage);
          resolve();
        }, 100);
      }
    });
  });

  try {
    await Promise.all(loadPromises);

    // Ensure we reach 100% before transitioning
    setLoadingProgress(100);

    // Mark preloading as complete
    preloadingCompleteFlag = true;

    // Small delay after reaching 100%
    setTimeout(() => {
      setIsLoaded(true);
    }, 800);
  } catch (error) {
    console.error("Error loading resources:", error);
    setLoadingProgress(100);

    // Mark as complete even on error to prevent infinite loading
    preloadingCompleteFlag = true;

    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }
};

// Export a function to check if preloading is complete
export const isPreloadingComplete = () => {
  return preloadingCompleteFlag;
};

// Export a function to check if a resource is loaded
export const isResourceLoaded = (url) => {
  return loadedResources.has(url);
};

// Export a function to reset preloading state (for development/testing)
export const resetPreloadingState = () => {
  preloadingCompleteFlag = false;
  preloadingPromise = null;
  loadedResources.clear();
};
