import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import OptionsMenu from "./OptionsMenu";
import { AnimatePresence } from "motion/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiForbidLine } from "@remixicon/react";

const MessagesList = ({ messages }) => {
  const user = useAuthStore((state) => state.user);
  const latestMessageRef = useRef(null);
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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

  function contextMenu(e, messageId, isDeleted) {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleted) return;

    setMenuCoords({
      x: e.clientX,
      y: e.clientY,
    });

    setOpenMessageMenuId(messageId);
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-transparent">
      <div className="flex flex-col px-4 py-6 gap-2">
        {messages?.map((message, index) => {
          if (!message) return null;

          const isLast = index === messages.length - 1;
          const senderId = message.sender?._id || message.senderId;

          const isMe = senderId === user?._id;

          const prev = messages[index - 1];
          const getSenderId = (msg) =>
            msg?.sender ? msg.sender._id : msg.senderId;

          const prevSenderId = prev ? getSenderId(prev) : null;
          const currentSenderId = getSenderId(message);

          const startsBlock = !prev || prevSenderId !== currentSenderId;

          const showHeader =
            message.conversationType === "group" &&
            !isMe &&
            startsBlock &&
            senderId;

          return (
            <div
              key={message._id}
              ref={isLast ? latestMessageRef : null}
              className={`flex ${
                isMe ? "justify-end" : "justify-start"
              } ${startsBlock ? "mt-4" : "mt-1"}`}
            >
              {!isMe && (
                <div className="w-10 shrink-0 flex justify-center">
                  {showHeader && (
                    <img
                      src={message.sender?.profilePicture}
                      alt={message.sender?.username || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>
              )}

              <div
                className={`relative max-w-[70%] border border-(--foreground-secondary)/20 py-1.5 px-0.5 flex flex-col ${
                  isMe
                    ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
                    : "bg-(--bg-secondary) rounded-xl rounded-bl-none px-1.5"
                } ${message.isDeleted ? "cursor-default" : "cursor-pointer"}`}
                onContextMenu={(e) =>
                  contextMenu(e, message._id, message.isDeleted)
                }
              >
                {message.replyTo && (
                  <div className="w-full rounded-sm bg-(--bg-primary)/40 flex">
                    <span className="bg-(--accent-color-secondary) w-1 rounded-l-full h-full" />

                    <div className="px-2 pb-1">
                      <span className="text-[12px] text-(--accent-color-secondary)">
                        {message.replyTo.sender._id === user._id
                          ? "You"
                          : message.replyTo.sender.username}
                      </span>

                      <p className="text-sm opacity-50">
                        {message.replyTo.text}
                      </p>
                    </div>
                  </div>
                )}
                <div className={`${message.replyTo ? "px-2 py-1" : "px-1"}`}>
                  {showHeader && (
                    <span className="text-[12px] font-medium text-(--accent-color-secondary) mb-1">
                      {message.sender?.username}
                    </span>
                  )}

                  {message.isDeleted ? (
                    <div className="flex gap-2 items-center">
                      <IconsWrapper
                        icon={RiForbidLine}
                        className="opacity-50"
                        size={20}
                      />

                      <p className="text-sm opacity-70 italic mr-14">
                        This message was deleted
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap mr-12">
                      {message.text}
                    </p>
                  )}

                  <div className="flex justify-end items-center gap-2">
                    {message.isEdited && (
                      <span className="text-[10px] opacity-40">Edited</span>
                    )}

                    <span className="text-[10px] opacity-40">
                      {message.createdAt ? formatTime(message.createdAt) : ""}
                    </span>
                  </div>
                </div>
              </div>

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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
