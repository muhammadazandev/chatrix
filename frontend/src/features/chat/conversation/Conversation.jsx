import { useEffect } from "react";
import useChatStore from "../../../store/useChatStore";
import Header from "./header/Header";
import MessageInput from "./messageInput/MessageInput";
import { useSearchParams } from "react-router-dom";
import MessagesList from "./messagesList/MessagesList";
import { socket } from "../../../socket/socket";
import { SOCKET_EVENTS } from "../../../socket/events";

const Conversation = () => {
  const getMessages = useChatStore((state) => state.getMessages);
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId,
  );
  const [searchParam, setSearchParam] = useSearchParams();
  const conId = searchParam.get("conversationId");
  const messages = useChatStore((state) => state.messages);

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
      setCurrentConversationId(conId);
      getMessages(conId);
    }

    get();
  }, [conId, getMessages, setCurrentConversationId]);

  return (
    <div className="flex-1 flex flex-col bg-(--bg-primary) h-screen relative overflow-hidden">
      <Header />
      <MessagesList messages={messages} />
      <MessageInput />
    </div>
  );
};

export default Conversation;
