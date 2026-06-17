import { useEffect, useRef } from "react";
import useAuthStore from "../../../../store/useAuthStore";

const MessagesList = ({ messages }) => {
  const user = useAuthStore((state) => state.user);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-transparent">
      <div className="flex flex-col px-4 py-6">
        {messages?.map((message, index) => {
          const isLast = index === messages.length - 1;
          const isMe = message.senderId === user?._id;

          const prev = messages[index - 1];
          const startsBlock = !prev || prev.senderId !== message.senderId;

          const showHeader =
            message.conversationType === "group" &&
            !isMe &&
            startsBlock &&
            message.sender;

          return (
            <div
              key={message._id}
              ref={isLast ? latestMessageRef : null}
              className={`flex flex-col ${
                isMe ? "items-end" : "items-start"
              } ${startsBlock ? "mt-5" : "mt-1"}`}
            >
              {showHeader && (
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <img
                    src={message.sender.profilePicture}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] tracking-wide opacity-60 uppercase">
                    {message.sender.username}
                  </span>
                </div>
              )}

              <div
                className={`relative max-w-[70%] px-3 py-2
                ${
                  isMe
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-xl rounded-br-none"
                    : "bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl rounded-bl-none"
                }
                shadow-sm transition-all`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>

                <div className="mt-1 flex justify-end">
                  <span className="text-[10px] opacity-40 tracking-wider">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
