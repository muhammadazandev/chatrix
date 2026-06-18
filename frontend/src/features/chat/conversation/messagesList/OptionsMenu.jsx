import { RiFileCopyLine } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import Motion from "../../../../motion/Motion";
import { fade } from "../../../../motion/variants";

const actionButtons = [
  {
    icon: RiFileCopyLine,
    label: "Copy Message",
    actionFun: "handleCopy",
  },
];

const OptionsMenu = ({ message, coords, isMe, onClose }) => {
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.text);
      onClose();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const actions = {
    handleCopy: handleCopy,
  };

  return (
    <Motion
      variants={fade}
      transition="spring"
      onClick={(e) => e.stopPropagation()}
      style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
      className={`absolute z-50 rounded-xl py-1.5 w-40 top-1/2 -translate-y-1/2 bg-(--bg-secondary) border border-(--foreground-secondary)/20 ${isMe ? "-translate-x-full" : ""}`}
    >
      {actionButtons.map((btn) => {
        return (
          <button
            onClick={actions[btn.actionFun]}
            key={btn.label}
            className="w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-2.5 text-(--foreground-primary)"
          >
            <IconsWrapper
              icon={btn.icon}
              size={15}
              className={btn.actionFun === "handleCopy" ? "rotate-180" : ""}
            />
            {btn.label}
          </button>
        );
      })}
    </Motion>
  );
};

export default OptionsMenu;
