import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "react-router-dom";

import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import useTypingIndicator from "../../../../hooks/useTypingIndicator";
import useMessageComposer from "../../../../hooks/useMessageComposer";

import useMessageUiStore from "../../../../store/useMessageUiStore";
import useChatStore from "../../../../store/useChatStore";

import MessageActions from "./MessageActions";
import MessageReply from "./MessageReply";
import MessageTextArea from "./MessageTextarea";

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

  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );

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
    if (!inputRef.current) return;

    inputRef.current.style.height = "auto";
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
  }, [value]);

  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      {currentConversation &&
      currentConversation.relationshipStatus !== "blocked" ? (
        <motion.div
          variants={shakeVariants}
          animate={isError ? "error" : "normal"}
          className="w-full rounded-3xl bg-(--bg-secondary)/80 py-2 px-3 border-2 border-transparent"
        >
          <MessageReply
            messageMode={messageMode}
            clearMessageMode={clearMessageMode}
          />

          <div className="w-full flex gap-4 items-end">
            <div className="w-full flex gap-4 items-end">
              <MessageActions
                isOpen={isOpen}
                togglePicker={togglePicker}
                handleEmojiSelect={handleEmojiSelect}
                closePicker={closePicker}
                messageMode={messageMode}
                cancelEditing={cancelEditing}
                sendMessage={sendMessage}
                side="left"
              />

              <MessageTextArea
                value={value}
                setValue={setValue}
                inputRef={inputRef}
                handleTyping={handleTyping}
                sendMessage={sendMessage}
                cancelEditing={cancelEditing}
              />

              <MessageActions
                messageMode={messageMode}
                cancelEditing={cancelEditing}
                sendMessage={sendMessage}
                side="right"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="w-full flex justify-center tracking-wider my-2">
          <p className="bg-(--bg-secondary)/50 rounded-md px-4 py-2 text-md">
            Can not chat with unblocked users
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
