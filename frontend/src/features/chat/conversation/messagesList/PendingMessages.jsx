import useMessageUiStore from "../../../../store/useMessageUiStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import MessageItem from "./MessageItem/MessageItem";
import { useEffect, useRef } from "react";

const PendingMessages = () => {
  const pendingMessages = useMessageUiStore((state) => state.pendingMessages);
  const messageRefs = useRef({});
  const { searchParams } = useQueryParams();
  const conversationId = searchParams.get("conversationId");

  const conversationPendingMessages = pendingMessages.filter(
    (msg) => msg.conversationId === conversationId,
  );

  useEffect(() => {
    if (messageRefs.current) {
      const lastPendingMessage = conversationPendingMessages.at(-1);

      const messageId = lastPendingMessage?._id || lastPendingMessage?.tempId;

      if (!lastPendingMessage) return;

      messageRefs.current[messageId]?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [pendingMessages, conversationPendingMessages, messageRefs]);

  return (
    <>
      {conversationPendingMessages.map((message) => (
        <MessageItem
          key={message.tempId}
          message={message}
          isPending
          messageRefs={messageRefs}
        />
      ))}
    </>
  );
};

export default PendingMessages;
