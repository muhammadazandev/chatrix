import { useAnimate } from "motion/react";
import useSettingsStore from "../store/useSettingsStore";

function useSlidePanelClose() {
  const [scope, animate] = useAnimate();
  const isAnimations = useSettingsStore((state) => state.isAnimations);
  const transition = useSettingsStore((state) => state.transition);

  async function close() {
    if (isAnimations) {
      await animate(
        scope.current,
        { opacity: 0, x: "-90%" },
        { duration: 0.4, ease: transition },
      );
    }
  }

  return {
    scope,
    close,
  };
}

export default useSlidePanelClose