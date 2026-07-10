 import { useEffect } from "react";
import { createPortal } from "react-dom";
import IconsWrapper from "./IconsWrapper";

const ContextMenu = ({
  coords,
  onClose,
  items,
  alignRight = false,
  className = "w-40",
}) => {
  useEffect(() => {
    window.addEventListener("click", onClose);
    window.addEventListener("scroll", onClose, true);

    return () => {
      window.removeEventListener("click", onClose);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ top: coords.y, left: coords.x }}
      className={`fixed z-150 rounded-xl py-1.5 bg-(--bg-secondary)
        border border-(--foreground-secondary)/20
        top-1/2 -translate-y-1/2
        ${alignRight ? "-translate-x-full" : ""}
        ${className}`}
    >
      {items.filter((item) => !item.hidden)
        .map((item) => (
          <div key={item.label}>
            {item.separator && (
              <div className="h-[0.1px] my-2 bg-(--foreground-primary)/20" />
            )}

            <button
              disabled={item.disabled}
              onClick={(e) => {
                item.onClick?.(e);

                if (!item.keepOpen) {
                  onClose();
                }
              }}
              className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center gap-2.5
                ${
                  item.danger
                    ? "danger-action no-hover"
                    : "text-(--foreground-primary) font-semibold"
                }`}
            >
              <IconsWrapper
                icon={item.icon}
                size={15}
                className={item.iconClassName}
              />

              {item.label}
            </button>
          </div>
        ))}
    </div>,
    document.body,
  );
};

export default ContextMenu;
