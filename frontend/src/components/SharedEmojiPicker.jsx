import { lazy, Suspense } from "react";

import { AnimatePresence } from "motion/react";
import Motion from "../motion/Motion";
import { popLift } from "../motion/variants";
import useSettingsStore from "../store/useSettingsStore";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

export default function SharedEmojiPicker({
  classes,
  isOpen,
  handleEmojiSelect,
  closePicker,
}) {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <div
            className="fixed top-0 left-0 z-40 h-screen w-screen bg-transparent"
            onClick={() => closePicker()}
          />
          <Motion
            variants={popLift}
            transition={"spring"}
            className={`${classes} z-50`}
          >
            <Suspense fallback={<div className="h-[350px] w-[320px]" />}>
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                lazyLoadEmojis={true}
                emojiStyle="google"
                theme={`${theme === "system" ? "auto" : theme}`}
                reactionsDefaultOpen={true}
                allowExpandReactions={true}
              />
            </Suspense>
          </Motion>
        </>
      )}
    </AnimatePresence>
  );
}
