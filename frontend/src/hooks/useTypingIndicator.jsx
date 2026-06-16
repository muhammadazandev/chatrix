import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";
import { SOCKET_EVENTS } from "../socket/events";

const useTypingIndicator = (conversationIdRef) => {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const previousIdRef = useRef(conversationIdRef.current);

  const emitStartTyping = () => {
    if (!conversationIdRef.current) return;

    socket.emit(SOCKET_EVENTS.START_TYPING, {
      conversationId: conversationIdRef.current,
    });
  };

  const emitStopTyping = (targetId) => {
    const id = targetId || conversationIdRef.current;
    if (!id) return;

    socket.emit(SOCKET_EVENTS.STOP_TYPING, {
      conversationId: id,
    });
  };

  const stopTypingNow = (conversationIdToStop) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      const stopId = conversationIdToStop || conversationIdRef.current;
      if (stopId) {
        socket.emit(SOCKET_EVENTS.STOP_TYPING, {
          conversationId: stopId,
        });
      }
    }
  };

  const handleTyping = () => {
    if (!conversationIdRef.current) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitStartTyping();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitStopTyping();
    }, 15000);
  };

  const activeRoomId = conversationIdRef.current;

  useEffect(() => {
    if (
      previousIdRef.current &&
      previousIdRef.current !== activeRoomId &&
      isTypingRef.current
    ) {
      stopTypingNow(previousIdRef.current);
    }

    previousIdRef.current = activeRoomId;

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current && conversationIdRef.current) {
        socket.emit(SOCKET_EVENTS.STOP_TYPING, {
          conversationId: conversationIdRef.current,
        });
      }
    };
  }, [activeRoomId]);

  return {
    stopTypingNow,
    handleTyping,
  };
};

export default useTypingIndicator;
