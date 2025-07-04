import { skills } from "../data/skills";
import { photoItems } from "../data/photos";

export const preloadResources = async (setLoadingProgress, setIsLoaded) => {
  // Get all images to preload
  const skillImages = skills.map((skill) => skill.image);
  const photoImages = photoItems.map((item) => item.img);
  const modelUrl = "/3d_models/plane.glb";

  // Combine all resources
  const allResources = [...skillImages, ...photoImages, modelUrl];
  const totalResources = allResources.length;
  let loadedCount = 0;

  // Reset loading progress at start
  setLoadingProgress(0);

  const loadPromises = allResources.map((url) => {
    return new Promise((resolve) => {
      if (
        url.endsWith(".svg") ||
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg") ||
        url.endsWith(".JPG") ||
        url.endsWith(".PNG")
      ) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loadedCount++;
          const percentage = Math.min(
            Math.round((loadedCount / totalResources) * 100),
            100
          );
          setLoadingProgress(percentage);
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          const percentage = Math.min(
            Math.round((loadedCount / totalResources) * 100),
            100
          );
          setLoadingProgress(percentage);
          resolve();
        };
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

    // Small delay after reaching 100%
    setTimeout(() => {
      setIsLoaded(true);
    }, 800);
  } catch (error) {
    console.error("Error loading resources:", error);
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
  }
};
