import { useEffect } from "react";
import useChatStore from "../../../store/useChatStore";
import Header from "./header/Header";
import MessageInput from "./messageInput/MessageInput";
import { useSearchParams } from "react-router-dom";
import MessagesList from "./messagesList/MessagesList";

const Conversation = () => {
  const getMessages = useChatStore((state) => state.getMessages);
  const [searchParam, setSearchParam] = useSearchParams();
  const conId = searchParam.get("conversationId");
  const messages = useChatStore((state) => state.messages);

  useEffect(() => {
    if (!conId) return;

    async function get() {
      getMessages(conId);
    }

    get();
  }, [conId]);

  return (
    <div className="flex-1 flex flex-col bg-(--bg-primary) h-screen relative overflow-hidden">
      <Header />
      <MessagesList />
      <MessageInput />
    </div>
  );
};

export default Conversation;
