import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import OptionsMenu from "./OptionsMenu";
import { AnimatePresence } from "motion/react";

const MessagesList = ({ messages }) => {
  const user = useAuthStore((state) => state.user);
  const latestMessageRef = useRef(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    latestMessageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const closeMenu = () => setOpenMessageMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

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
              className={`flex flex-col relative ${isMe ? "items-end" : "items-start"} ${startsBlock ? "mt-5" : "mt-1"}`}
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
                className={`relative max-w-[70%] border border-(--foreground-secondary)/20 cursor-pointer px-3 py-2 ${isMe ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none" : "bg-(--bg-secondary) rounded-xl rounded-bl-none"}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const rect = e.currentTarget.getBoundingClientRect();

                  console.log(rect);

                  setMenuCoords({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });

                  setOpenMessageMenuId(message._id);
                }}
              >
                <AnimatePresence>
                  {openMessageMenuId === message._id && (
                    <OptionsMenu
                      message={message}
                      coords={menuCoords}
                      isMe={isMe}
                      onClose={() => setOpenMessageMenuId(null)}
                    />
                  )}
                </AnimatePresence>

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
