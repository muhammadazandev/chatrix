import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect, useRef } from "react";
import IconsWrapper from "../../../../../../components/IconsWrapper";
import { RiCloseLine, RiCheckLine, RiShuffleLine } from "@remixicon/react";
import { accentColors } from "./accentColors";
import Tooltip from "../../../../../../components/Tooltip";
import useSettingsStore from "../../../../../../store/useSettingsStore";
import Motion from "../../../../../../motion/Motion";
import { fade, slideInRight } from "../../../../../../motion/variants";

const AccentColor = () => {
  const [isColorsBoxOpen, setIsColorsBoxOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const itemRefs = useRef({}); // Tracks each item's DOM node for auto-scrolling
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  const accentColor = useSettingsStore((state) => state.accentColor);

  const [previewColor, setPreviewColor] = useState(accentColor);

  const handleColorCommit = (color) => {
    updateSetting("accentColor", color);
    document.documentElement.style.setProperty("--accent-color-primary", color);
    setIsColorsBoxOpen(false);
  };

  const handleRandomSelect = () => {
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 500);

    const randomIndex = Math.floor(Math.random() * accentColors.length);
    const selectedRandomColor = accentColors[randomIndex];
    setPreviewColor(selectedRandomColor);

    const targetElement = itemRefs.current[selectedRandomColor];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    if (isColorsBoxOpen) setPreviewColor(accentColor);
  }, [isColorsBoxOpen]);

  return (
    <div className="mt-2">
      <h3 className="text-sm font-medium tracking-wide capitalize opacity-40">
        Accent Color
      </h3>

      <button
        className="inline-flex w-full items-center justify-between rounded px-4 py-3 mt-3 border border-(--foreground-secondary)/50 bg-(--bg-secondary)/10 font-medium text-sm group"
        onClick={() => setIsColorsBoxOpen(true)}
      >
        <span className="text-(--foreground-primary) opacity-90">
          Accent Color
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono opacity-30 uppercase">
            {accentColor}
          </span>
          <span
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isColorsBoxOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <Motion
              variants={fade}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setIsColorsBoxOpen(false)}
            />

            <Motion
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: "0%" }}
              exit={{ opacity: 0, x: "100%" }}
              transition="spring"
              className="relative w-full max-w-sm h-full border-l border-(--foreground-secondary)/15 bg-(--bg-primary) shadow-2xl z-10 flex flex-col"
            >
              <header className="flex items-center justify-between px-6 py-5 border-b border-(--foreground-secondary)/10">
                <div>
                  <h2 className="text-base font-bold text-(--foreground-primary)">
                    App Palette
                  </h2>
                  <p className="text-xs opacity-40 mt-0.5 font-medium">
                    Scroll and test every color token.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Tooltip content="Suprise Me">
                    <motion.button
                      type="button"
                      onClick={handleRandomSelect}
                      animate={{ rotate: isSpinning ? 360 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="rounded-full p-2 hover:bg-(--bg-secondary) text-(--foreground-secondary) hover:text-(--foreground-primary) cursor-pointer transition-colors flex items-center justify-center active:scale-90"
                    >
                      <IconsWrapper icon={RiShuffleLine} size={18} />
                    </motion.button>
                  </Tooltip>

                  <Tooltip content="Close">
                    <button
                      type="button"
                      className="rounded-full p-2 hover:bg-(--bg-secondary) text-(--foreground-secondary) hover:text-(--foreground-primary) cursor-pointer transition-colors flex items-center justify-center"
                      onClick={() => setIsColorsBoxOpen(false)}
                    >
                      <IconsWrapper icon={RiCloseLine} size={18} />
                    </button>
                  </Tooltip>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto px-6 py-4 space-y-2 no-scrollbar scroll-smooth">
                {accentColors.map((color) => {
                  const isCurrentlySelected = previewColor === color;
                  return (
                    <button
                      type="button"
                      key={color}
                      ref={(el) => (itemRefs.current[color] = el)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-150 group/row cursor-pointer
                        ${
                          isCurrentlySelected
                            ? "bg-(--bg-secondary) border-(--foreground-secondary)/30 text-(--foreground-primary)"
                            : "bg-transparent border-transparent hover:bg-(--bg-secondary)/40 opacity-70 hover:opacity-100"
                        }`}
                      onClick={() => setPreviewColor(color)}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className="w-8 h-8 rounded-lg shrink-0 shadow-sm transition-transform duration-200 group-hover/row:scale-105"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-semibold uppercase tracking-wide text-(--foreground-primary)">
                            Tonal Shade
                          </span>
                          <span className="text-[10px] font-mono opacity-40 uppercase mt-0.5">
                            {color}
                          </span>
                        </div>
                      </div>

                      {isCurrentlySelected && (
                        <motion.div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                          style={{ backgroundColor: previewColor }}
                        >
                          <IconsWrapper icon={RiCheckLine} size={12} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </main>

              <footer className="px-6 py-4 bg-(--bg-secondary)/20 border-t border-(--foreground-secondary)/10 flex gap-3 justify-end items-center">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-(--foreground-secondary) hover:text-(--foreground-primary) transition-all cursor-pointer"
                  onClick={() => setIsColorsBoxOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 shadow-md cursor-pointer hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: previewColor }}
                  onClick={() => handleColorCommit(previewColor)}
                >
                  Apply Accent
                </button>
              </footer>
            </Motion>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccentColor;
