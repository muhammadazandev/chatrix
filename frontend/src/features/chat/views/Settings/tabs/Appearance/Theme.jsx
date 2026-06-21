import { RiArrowDownSLine, RiCheckLine } from "@remixicon/react";
import IconsWrapper from "../../../../../../components/IconsWrapper";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import useSettingsStore from "../../../../../../store/useSettingsStore";
import Motion from "../../../../../../motion/Motion";
import { popLift } from "../../../../../../motion/variants";

const Theme = () => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const updateSetting = useSettingsStore((state) => state.updateSetting);
  const theme = useSettingsStore((state) => state.theme);

  function handleThemeChange(newTheme) {
    updateSetting("theme", newTheme);
    setIsSelectorOpen(false);
  }

  return (
    <div className="mt-2">
      <h3 className="text-sm font-medium tracking-wide capitalize opacity-40">
        Theme
      </h3>
      <div className="relative">
        <button
          className="inline-flex w-full items-center justify-between rounded-sm px-4 py-3 mt-3 border border-(--foreground-secondary)/50 font-medium text-sm"
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
        >
          <span className="capitalize">{theme}</span>
          <motion.div
            animate={{ rotate: isSelectorOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center opacity-70"
          >
            <IconsWrapper icon={RiArrowDownSLine} />
          </motion.div>
        </button>

        {isSelectorOpen && (
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsSelectorOpen(false)}
          />
        )}

        <AnimatePresence>
          {isSelectorOpen && (
            <Motion
              variants={popLift}
              className="absolute left-0 right-0 mt-2 z-50 rounded-sm border border-(--foreground-secondary) flex flex-col p-1.5 overflow-hidden origin-top bg-(--bg-primary) backdrop-blur-md"
            >
              {["light", "dark", "system"].map((el) => {
                const isActive = theme === el;
                return (
                  <button
                    key={el}
                    className={`flex items-center justify-between w-full px-3.5 py-2.5 my-0.5 text-xs font-semibold tracking-wider uppercase rounded-md cursor-pointer transition-all duration-150
                      ${
                        isActive
                          ? "bg-(--bg-secondary) text-(--foreground-primary)"
                          : "hover:bg-(--bg-secondary)/50 opacity-70 hover:opacity-100 text-(--foreground-primary)"
                      }`}
                    onClick={() => handleThemeChange(el)}
                  >
                    <span>{el}</span>
                    {isActive && (
                      <div className="scale-85 opacity-90 text-(--foreground-primary)">
                        <IconsWrapper icon={RiCheckLine} />
                      </div>
                    )}
                  </button>
                );
              })}
            </Motion>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Theme;
