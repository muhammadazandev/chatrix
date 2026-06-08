import { motion } from "motion/react";
import { transitions } from "./transitions";
import useSettingsStore from "../store/useSettingsStore";

const motionPropsList = [
  "initial",
  "animate",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileInView",
  "layout",
  "layoutId",
  "drag",
];

const Motion = ({
  as = "div",
  children,
  transition,
  variants,
  initial = "initial",
  animate = "animate",
  exit = "exit",
  ...props
}) => {
  const isAnimations = useSettingsStore((state) => state.isAnimations);
  const globalTransition = useSettingsStore((state) => state.transition);

  const resolvedTransition =
    typeof transition === "object"
      ? transition
      : transitions[transition || globalTransition];

  if (!isAnimations) {
    const Component = as;

    const filteredProps = { ...props };

    motionPropsList.forEach((key) => {
      delete filteredProps[key];
    });

    return <Component {...filteredProps}>{children}</Component>;
  }

  const Element = motion[as] || motion.div;

  return (
    <Element
      {...props}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={resolvedTransition}
    >
      {children}
    </Element>
  );
};

export default Motion;
