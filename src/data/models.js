export const models = {
  plane: {
    url: "3d_models/plane.glb",
    defaultRotationX: -13.6,
    defaultRotationY:-2.1,
    defaultZoom: 0.1,
  },
  // Add more models in the future
  // example: {
  //   url: "/3d_models/example.glb",
  //   defaultRotationX: 0,
  //   defaultRotationY: 0,
  //   defaultZoom: 1,
  // }
};

// Get all model URLs for preloading
export const getAllModelUrls = () => {
  return Object.values(models).map((model) => model.url);
};
