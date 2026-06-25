import {
  RiCloseLine,
  RiEmotionHappyLine,
  RiSendPlane2Fill,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router-dom";
import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";
import Tooltip from "../../../../components/Tooltip";
import useTypingIndicator from "../../../../hooks/useTypingIndicator";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import useMessageComposer from "../../../../hooks/useMessageComposer";
import ReplyCard from "../shared/ReplyCard";

const shakeVariants = {
  error: {
    x: [-10, 10, -10, 10, -5, 5, 0],
    borderColor: "#ef4444",
    transition: { duration: 0.4 },
  },
  normal: {
    x: 0,
    borderColor: "transparent",
  },
};

const MessageInput = () => {
  const messageMode = useMessageUiStore((state) => state.messageMode);
  const clearMessageMode = useMessageUiStore((state) => state.clearMessageMode);

  const [isError, setIsError] = useState(false);
  const [searchParams] = useSearchParams();

  const conversationId = searchParams.get("conversationId");
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;
  const inputRef = useRef(null);

  const { stopTypingNow, handleTyping } = useTypingIndicator(conversationIdRef);
  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");
  const { sendMessage } = useMessageComposer({
    stopTypingNow,
    conversationIdRef,
    closePicker,
    value,
    setValue,
    setIsError,
    inputRef,
  });

  const cancelEditing = () => {
    clearMessageMode();
    setValue("");
  };

  useEffect(() => {
    cancelEditing();
  }, [conversationId]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      <motion.div
        variants={shakeVariants}
        animate={isError ? "error" : "normal"}
        className={`w-full rounded-3xl bg-(--bg-secondary)/80 py-2 px-3 border-2 border-transparent`}
      >
        <AnimatePresence>
          {messageMode.type === "reply" && (
            <ReplyCard
              replyMessage={messageMode.payload}
              showCloseButton
              onClose={clearMessageMode}
              animated
            />
          )}
        </AnimatePresence>
        <div className="w-full flex gap-4 z-50 items-end">
          <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
            <button
              className="p-2 rounded-full shrink-0 z-50"
              onClick={togglePicker}
            >
              <IconsWrapper icon={RiEmotionHappyLine} size={25} />
            </button>
          </Tooltip>

          <SharedEmojiPicker
            isOpen={isOpen}
            handleEmojiSelect={handleEmojiSelect}
            closePicker={closePicker}
            classes="absolute origin-bottom-left bottom-25 left-2"
          />

          <textarea
            placeholder="Enter Your Message"
            className="w-full outline-none bg-transparent z-50 resize-none max-h-25 min-h-[20px] py-2"
            ref={inputRef}
            rows={1}
            onChange={(e) => {
              setValue(e.target.value);
              handleTyping();
            }}
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              } else if (e.key === "Escape") {
                cancelEditing();
              }
            }}
          />

          {messageMode.type === "edit" && (
            <Tooltip content="Cancel Editing" delay={[1000, 0]}>
              <button
                className="p-3 bg-(--bg-secondary) shrink-0 rounded-full border border-(--foreground-secondary)/10"
                onClick={cancelEditing}
              >
                <IconsWrapper
                  icon={RiCloseLine}
                  size={16}
                  className="scale-120"
                />
              </button>
            </Tooltip>
          )}

          <Tooltip
            content={`${messageMode.type === "edit" ? "Edit" : "Send"} Message`}
            delay={[1000, 0]}
          >
            <button
              className="p-3 bg-(--accent-color-primary) rounded-full shrink-0 z-50 max-h-fit"
              onClick={sendMessage}
            >
              <IconsWrapper icon={RiSendPlane2Fill} size={18} />
            </button>
          </Tooltip>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageInput;
