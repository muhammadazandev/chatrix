import {
  RiAddLine,
  RiFile3Line,
  RiFileMusicLine,
  RiImageLine,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import Tooltip from "../../../../components/Tooltip";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import Motion from "../../../../motion/Motion";
import { slideHeightExpand } from "../../../../motion/variants";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import toast from "react-hot-toast";

const MediaMessagesButtons = () => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const setMediaPreviewInfo = useMessageUiStore(
    (state) => state.setMediaPreviewInfo,
  );

  const handleBlur = (e) => {
    const nextFocused = e.relatedTarget;
    if (nextFocused && menuRef.current?.contains(nextFocused)) return;
    setIsSelectorOpen(false);
  };

  const handleFileChange = (e) => {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files[0].size > MAX_FILE_SIZE) {
      toast.error("Files larger than 100 MB aren't supported.");
      e.target.value = "";
      setSelectedButton(null);
      return;
    }

    const url = URL.createObjectURL(files[0]);

    setMediaPreviewInfo({ file: files[0], url, type: selectedButton });

    e.target.value = "";
    setSelectedButton(null);
  };

  useEffect(() => {
    const fileInput = fileInputRef.current;
    if (!selectedButton || !fileInput) return;

    const ACCEPT_TYPES = {
      media: "image/*,video/*",
      audio: "audio/*",
      file: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.json,.xml,.html",
    };

    fileInput.accept = ACCEPT_TYPES[selectedButton];

    if ("showPicker" in HTMLInputElement.prototype) {
      fileInput.showPicker();
    } else {
      fileInput.click();
    }

    setIsSelectorOpen(false);
  }, [selectedButton]);

  useEffect(() => {
    const input = fileInputRef.current;
    if (!input) return;

    const handleCancel = () => {
      setSelectedButton(null);
    };

    input.addEventListener("cancel", handleCancel);

    return () => {
      input.removeEventListener("cancel", handleCancel);
    };
  }, []);

  return (
    <div ref={menuRef} onBlur={handleBlur} className="relative">
      <Tooltip content="Attach files" delay={[1000, 0]}>
        <button
          className="p-2 rounded-full z-50"
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
        >
          <IconsWrapper icon={RiAddLine} size={22} />
        </button>
      </Tooltip>

      <input
        type="file"
        className="opacity-0 pointer-events-none -z-50 absolute"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {isSelectorOpen && (
          <Motion
            variants={slideHeightExpand}
            transition="subtle"
            className="mt-2 w-42 z-50 rounded-xl border border-(--foreground-secondary)/30 bg-(--bg-primary) shadow-[0_0_15px_var(--foreground-primary)]/5 flex flex-col origin-top-left overflow-hidden p- absolute bottom-20 left-0"
          >
            {["File", "Media", "Audio"].map((button) => {
              return (
                <button
                  key={button}
                  className={`w-full px-3 py-2.5 my-0.5 inline-flex gap-3.5 items-center text-sm font-medium rounded-lg no-hover text-(--foreground-primary) hover:bg-(--bg-secondary) opacity-85 hover:opacity-100 button`}
                  onClick={() => setSelectedButton(button.toLowerCase())}
                >
                  <IconsWrapper
                    icon={
                      button === "File"
                        ? RiFile3Line
                        : button === "Audio"
                          ? RiFileMusicLine
                          : RiImageLine
                    }
                    size={18}
                  />
                  {button}
                </button>
              );
            })}
          </Motion>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaMessagesButtons;
