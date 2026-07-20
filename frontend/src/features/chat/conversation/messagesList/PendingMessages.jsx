import useMessageUiStore from "../../../../store/useMessageUiStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import MessageItem from "./MessageItem";

const PendingMessages = () => {
  const pendingMessages = useMessageUiStore((state) => state.pendingMessages);

  const { searchParams } = useQueryParams();
  const conversationId = searchParams.get("conversationId");

  const conversationPendingMessages = pendingMessages.filter(
    (msg) => msg.conversationId === conversationId,
  );

  return (
    <>
      {conversationPendingMessages.map((message) => (
        <MessageItem key={message.tempId} message={message} isPending />
      ))}
    </>
  );
};

export default PendingMessages;
