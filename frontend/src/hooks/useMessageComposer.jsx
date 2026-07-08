import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import { SOCKET_EVENTS } from "../socket/events";
import toast from "react-hot-toast";
import useMessageUiStore from "../store/useMessageUiStore";

const useMessageComposer = ({
  stopTypingNow,
  conversationIdRef,
  closePicker,
  value,
  setValue,
  setIsError,
  inputRef,
}) => {
  const errorTimeoutRef = useRef(null);
  const messageMode = useMessageUiStore((state) => state.messageMode);
  const clearMessageMode = useMessageUiStore((state) => state.clearMessageMode);

  const handleEditMessage = (text) => {
    if (!text) {
      toast.error("Message cannot be empty");
      return;
    }

    socket.emit(
      SOCKET_EVENTS.EDIT_MESSAGE,
      { messageId: messageMode.payload._id, editedMessage: text },
      (res) => {
        if (!res?.success) {
          return toast.error(`${res?.message ? `: ${res.message}` : ""}`);
        }
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
      message: {
        text,
        conversationId: conversationIdRef.current,
        replyTo: messageMode.type === "reply" ? messageMode.payload._id : null,
      },
    };
    socket.emit(SOCKET_EVENTS.NEW_MESSAGE, data, (res) => {
      if (!res?.success) {
        toast.error(`${res?.message ? `${res.message}` : ""}`);
      }
    });

    setValue("");
  };

  const sendMessage = () => {
    if (!conversationIdRef.current) return;
    stopTypingNow();
    closePicker();

    const inputText = value.trim();

    if (messageMode.type === "edit") {
      handleEditMessage(inputText);
    } else {
      handleNewMessage(inputText);
    }

    clearMessageMode();
    setValue("");
  };

  useEffect(() => {
    if (messageMode.type === "edit") {
      setValue(messageMode.payload.text);
      inputRef.current?.focus();
    } else if (messageMode.type === "reply") {
      inputRef.current?.focus();
    }
  }, [messageMode.type]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  return { sendMessage };
};

export default useMessageComposer;
