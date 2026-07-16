import { useEffect } from "react";
import useChatStore from "../../../store/useChatStore";
import Header from "./header/Header";
import MessageInput from "./messageInput/MessageInput";
import { useSearchParams } from "react-router-dom";
import MessagesList from "./messagesList/MessagesList";
import { socket } from "../../../socket/socket";
import { SOCKET_EVENTS } from "../../../socket/events";
import TypingIndicator from "./typingIndicator/TypingIndicator";
import useMessageUiStore from "../../../store/useMessageUiStore";
import ForwardMessage from "./ForwardMessage";
import { AnimatePresence } from "motion/react";
import { useQueryParams } from "../../../hooks/useQueryParams";
import MediaPreviewModal from "./messageInput/MediaPreviewModal";

const Conversation = () => {
  const getMessages = useChatStore((state) => state.getMessages);
  const [searchParam] = useSearchParams();
  const conId = searchParam.get("conversationId");
  const messages = useChatStore((state) => state.messages);
  const conversations = useChatStore((state) => state.conversations);
  const shouldCloseConversation = useChatStore(
    (state) => state.shouldCloseConversation,
  );
  const forwardMessageId = useMessageUiStore((state) => state.forwardMessageId);
  const mediaPreviewInfo = useMessageUiStore((state) => state.mediaPreviewInfo);
  const { updateParams } = useQueryParams();

  useEffect(() => {
    if (!conId) return;

    socket.emit(SOCKET_EVENTS.JOIN_CONVERSATION, conId);

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_CONVERSATION, conId);
    };
  }, [conId]);

  useEffect(() => {
    if (!conId) return;

    async function get() {
      getMessages(conId);
    }

    get();
  }, [conId, getMessages]);

  useEffect(() => {
    if (!shouldCloseConversation) return;

    updateParams(
      {
        conversationId: null,
        view: null,
      },
      true,
    );

    useChatStore.setState({
      shouldCloseConversation: false,
    });
  }, [updateParams, shouldCloseConversation]);

  return (
    <div className="flex-1 flex flex-col bg-(--bg-primary) h-screen relative overflow-hidden">
      <Header />
      <MessagesList messages={messages} />
      <TypingIndicator />
      <MessageInput />

      <AnimatePresence mode="wait">
        {forwardMessageId && conversations && (
          <ForwardMessage
            forwardMessageId={forwardMessageId}
            conversations={conversations}
          />
        )}

        {mediaPreviewInfo && <MediaPreviewModal />}
      </AnimatePresence>
    </div>
  );
};

export default Conversation;
