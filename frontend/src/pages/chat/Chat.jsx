import { useSearchParams } from "react-router-dom";
import Conversation from "../../features/chat/conversation/Conversation";
import ChatSidebar from "../../features/chat/sidebar/ChatSidebar";

const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex">
      <ChatSidebar />

      {searchParams.get("conversationId") ? <Conversation /> : null}
    </div>
  );
};

export default Chat;
