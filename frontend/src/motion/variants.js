const slideFade = {
  initial: {
    opacity: 0,
    y: 50,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -50,
  },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const slideInLeft = {
  initial: {
    opacity: 0,
    x: "-100%",
  },

  animate: {
    opacity: 1,
    x: "0",
  },
};

const slideFadeScale = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },

  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },

  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
};

const popLift = {
  initial: {
    scale: 0.8,
    opacity: 0,
    y: -4,
  },

  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
  },

  exit: {
    scale: 0.8,
    opacity: 0,
    y: -4,
  },
};

const slideInRight = {
  initial: { x: 30 },
  animate: { x: 0 },
  exit: { x: -30 },
};

const slideInFromLeft = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

export {
  slideFade,
  fade,
  slideInLeft,
  slideFadeScale,
  popLift,
  slideInRight,
  slideInFromLeft,
};
