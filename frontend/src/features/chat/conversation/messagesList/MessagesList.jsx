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
          const isSendByMe = message.senderId === user?._id;

          return (
            <div
              ref={isLastMessage ? latestMessageRef : null}
              key={message._id}
              className={`max-w-[60%] rounded-md py-1 px-3 ${isSendByMe ? "bg-(--accent-color-primary) self-end" : "bg-(--bg-secondary) self-start"}`}
            >
              <p className={`text-sm`}>{message.text}</p>

              <div>
                <p
                  className={`text-xs mt-1 opacity-50 ${isSendByMe ? "text-right" : "text-left"}`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
