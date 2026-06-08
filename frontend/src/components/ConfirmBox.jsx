import { createPortal } from "react-dom";
import { RiErrorWarningLine } from "@remixicon/react";
import { fade, slideFadeScale } from "../motion/variants";
import Motion from "../motion/Motion";

const ConfirmBox = ({ confirmWhat, onConfirm, setIsConfirmOpen }) => {
  return createPortal(
    <Motion
      variants={fade}
      className="fixed inset-0 z-100 flex items-center justify-center bg-(--foreground-primary)/20 backdrop-blur-[2px]"
    >
      <Motion
        variants={slideFadeScale}
        transition="spring"
        className="w-85 overflow-hidden rounded-2xl bg-(--bg-primary) shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-(--bg-secondary)"
      >
        <div className="p-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--bg-secondary)">
              <RiErrorWarningLine size={24} color="var(--foreground-primary)" />
            </div>
          </div>
          <h2 className="text-center text-lg font-bold text-(--foreground-primary)">
            Are you sure?
          </h2>
          <p className="mt-2 text-center text-sm text-(--foreground-primary)/70 leading-relaxed">
            {confirmWhat === "block"
              ? "This user will be blocked. You will no longer be able to communicate with them."
              : "This action is irreversible. Are you certain you want to proceed?"}
          </p>
        </div>

        <div className="flex border-t border-(--bg-secondary)">
          <button
            onClick={() => setIsConfirmOpen(false)}
            className="flex-1 py-4 text-sm font-medium text-(--foreground-primary)/60 hover:bg-(--bg-secondary) transition-colors"
          >
            Cancel
          </button>
          <div className="w-px bg-(--bg-secondary)" />
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-sm font-bold text-(--accent-color-primary) hover:bg-(--bg-secondary) transition-colors"
          >
            Confirm
          </button>
        </div>
      </Motion>
    </Motion>,
    document.body,
  );
};

export default ConfirmBox;
