import {
  RiCloseLine,
  RiEmotionHappyLine,
  RiSendPlane2Fill,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";
import Tooltip from "../../../../components/Tooltip";
import useTypingIndicator from "../../../../hooks/useTypingIndicator";

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

const MessageInput = ({
  setMessageInput,
  messageInput,
  editingMessage,
  setEditingMessage,
}) => {
  const errorTimeoutRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [searchParams] = useSearchParams();

  const conversationId = searchParams.get("conversationId");
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");

  const { stopTypingNow, handleTyping } = useTypingIndicator(conversationIdRef);
  const inputRef = useRef(null);

  const cancelEditing = () => {
    setMessageInput(null);
    setEditingMessage(null);
  };

  const handleEditMessage = (text) => {
    if (!text) {
      toast.error("Message cannot be empty");
      return;
    }

    socket.emit(
      SOCKET_EVENTS.EDIT_MESSAGE,
      { messageId: editingMessage._id, editedMessage: text },
      (res) => {
        if (!res?.success) {
          return toast.error(
            `Failed to edit message ${res?.message ? `: ${res.message}` : ""}`,
          );
        }

        cancelEditing();
      },
    );
  };

  const handleNewMessage = (text) => {
    if (!text) {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }

      setIsError(true);

      errorTimeoutRef.current = setTimeout(() => {
        setIsError(false);
      }, 500);

      return;
    }

    const data = {
      message: text,
      conversationId: conversationIdRef.current,
    };

    socket.emit(SOCKET_EVENTS.NEW_MESSAGE, data, (res) => {
      if (!res?.success) {
        toast.error(
          `Failed to send message${res?.message ? `: ${res.message}` : ""}`,
        );
      }
    });

    setValue("");
  };

  const sendMessage = () => {
    if (!conversationIdRef.current) return;
    stopTypingNow();
    closePicker();

    const inputText = editingMessage ? messageInput : value;

    if (editingMessage) {
      handleEditMessage(inputText.trim());
    } else {
      handleNewMessage(inputText.trim());
    }
  };

  useEffect(() => {
    if (editingMessage) {
      inputRef.current?.focus();
    }
  }, [editingMessage]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setValue("");
    cancelEditing();
  }, [conversationId]);

  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      <motion.div
        variants={shakeVariants}
        animate={isError ? "error" : "normal"}
        className={`w-full rounded-full bg-(--bg-secondary) py-2 px-3 flex gap-4 border-2 border-transparent`}
      >
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

        <input
          type="text"
          placeholder="Enter Your Message"
          className="w-full outline-none bg-transparent z-50"
          ref={inputRef}
          onChange={(e) => {
            if (editingMessage) {
              setMessageInput(e.target.value);
            } else {
              setValue(e.target.value);
            }
            handleTyping();
          }}
          value={editingMessage ? messageInput : value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            } else if (e.key === "Escape") {
              cancelEditing();
            }
          }}
        />

        {editingMessage && (
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
          content={`${editingMessage ? "Edit" : "Send"} Message`}
          delay={[1000, 0]}
        >
          <button
            className="p-3 bg-(--accent-color-primary) rounded-full shrink-0 z-50"
            onClick={sendMessage}
          >
            <IconsWrapper icon={RiSendPlane2Fill} size={18} />
          </button>
        </Tooltip>
      </motion.div>
    </div>
  );
};

export default MessageInput;
