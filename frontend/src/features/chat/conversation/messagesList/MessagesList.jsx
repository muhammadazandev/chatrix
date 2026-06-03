import { useEffect, useRef } from "react";
import useAuthStore from "../../../../store/useAuthStore";

const MessagesList = ({ messages }) => {
  const user = useAuthStore((state) => state.user);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="flex flex-col gap-5 py-5 px-5">
        {messages?.map((message, index) => {
          const isLastMessage = index === messages.length - 1;

          return (
            <div
              ref={isLastMessage ? latestMessageRef : null}
              key={message._id}
              className={`max-w-[50%] rounded-sm py-2 px-4 ${message.senderId === user?._id ? "bg-(--accent-color-primary) self-end" : "bg-(--bg-secondary) self-start"}`}
            >
              <p>{message.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
