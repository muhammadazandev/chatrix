import { AnimatePresence } from "motion/react";
import useAuthStore from "../../../../store/useAuthStore";
import OptionsMenu from "./OptionsMenu";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiForbidLine, RiShareForwardLine } from "@remixicon/react";
import ReplyCard from "../shared/ReplyCard";

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const MessageItem = ({
  message,
  contextMenu,
  prevMessage,
  openMessageMenuId,
  messageRefs,
  menuCoords,
  closeMenu,
}) => {
  const user = useAuthStore((state) => state.user);

  if (!message) return null;

  const senderId = message.sender?._id || message.senderId;

  const isMe = senderId === user?._id;

  const getSenderId = (msg) => (msg?.sender ? msg.sender._id : msg?.senderId);

  const prevSenderId = getSenderId(prevMessage);
  const currentSenderId = getSenderId(message);

  const startsBlock = !prevMessage || prevSenderId !== currentSenderId;

  const showHeader =
    message.conversationType === "group" && !isMe && startsBlock && senderId;

  function handleMultipleTargets(targets) {
    const formatter = new Intl.ListFormat("en", {
      style: "long",
      type: "conjunction",
    });

    if (targets.length === 1) return targets[0];
    if (targets.length > 1 && targets.length <= 3)
      return formatter.format(targets);
    if (targets.length > 3) return `${targets.length} participants`;
  }

  function renderSystemMessage() {
    if (!message) return;
    const actorName = message.metadata?.actor?.username;
    const targetNames = message.metadata?.targets
      ? handleMultipleTargets(
          message.metadata.targets.map((target) => target.username),
        )
      : null;

    switch (message.systemAction) {
      case "member_removed":
        return `${actorName} removed ${targetNames}`;

      case "member_added":
        return `${actorName} added ${targetNames}`;

      case "member_left":
        return `${actorName} left group`;

      case "member_promoted":
        return `${actorName} promoted ${targetNames} to admin`;

      case "member_demoted":
        return `${actorName} demoted ${targetNames} to member`;

      case "group_renamed":
        return `${actorName} (owner) changed name from ${message.metadata.oldValue} to ${message.metadata.newValue}`;

      case "group_photo_changed":
        return `${actorName} (owner) changed group photo`;

      default:
        return "";
    }
  }

  return (
    <div
      ref={(el) => {
        if (el) {
          messageRefs.current[message._id] = el;
        } else {
          delete messageRefs.current[message._id];
        }
      }}
      className={`flex ${
        isMe ? "justify-end" : "justify-start"
      } ${startsBlock ? "mt-4" : "mt-1"}`}
    >
      {!isMe && message.conversationType === "group" && message.senderId && (
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

      {message.messageType === "system" ? (
        <div className="w-full flex justify-center opacity-90 tracking-wider my-2">
          <p className="bg-(--bg-secondary)/50 rounded-md px-4 py-2 text-[12px]">
            {renderSystemMessage()}
          </p>
        </div>
      ) : (
        <div
          className={`relative max-w-[70%] border border-(--foreground-secondary)/20 py-1.5 px-0.5 flex flex-col ${
            isMe
              ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
              : "bg-(--bg-secondary) rounded-xl rounded-bl-none px-1.5"
          } ${message.isDeleted ? "cursor-default" : "cursor-pointer"}`}
          onContextMenu={(e) => contextMenu(e, message._id, message.isDeleted)}
        >
          {message.isForwarded && (
            <div
              className={`flex items-center gap-1 px-2 pt-1 ${
                isMe ? "text-white/70" : "text-(--foreground-secondary)"
              }`}
            >
              <IconsWrapper
                icon={RiShareForwardLine}
                size={13}
                className="opacity-70"
              />

              <span className="text-[11px] italic opacity-70 select-none">
                Forwarded
              </span>
            </div>
          )}

          {message.replyTo && <ReplyCard replyMessage={message.replyTo} />}
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
              <p className="text-sm leading-relaxed whitespace-pre-wrap mr-12 break-all">
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
      )}

      <AnimatePresence>
        {openMessageMenuId === message._id && (
          <OptionsMenu
            message={message}
            coords={menuCoords}
            isMe={isMe}
            onClose={closeMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageItem;
