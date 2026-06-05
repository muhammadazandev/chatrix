import { useSearchParams } from "react-router-dom";
import Conversation from "../../features/chat/conversation/Conversation";
import ChatSidebar from "../../features/chat/sidebar/ChatSidebar";

const Chat = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  return (
    <div className="flex">
      <ChatSidebar />

      {conversationId ? (
        <Conversation />
      ) : (
        <div className="h-screen flex flex-col w-full items-center justify-center opacity-75 gap-3 text-center">
          <h2 className="font-medium tracking-wider text-3xl">
            Select a conversation
          </h2>
          <h5 className="max-w-[30%] opacity-60">
            Choose a chat from the sidebar to start messaging.
          </h5>
        </div>
      )}
    </div>
  );
};

export default Chat;
