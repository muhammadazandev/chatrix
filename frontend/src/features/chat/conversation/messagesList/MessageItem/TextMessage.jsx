import { RiForbidLine, RiShareForwardLine } from "@remixicon/react";
import IconsWrapper from "../../../../../components/IconsWrapper";
import ReplyCard from "../../shared/ReplyCard";
import { formatTime } from "../../../../../utils/messagesHelpers";

const TextMessage = ({ isMe, message, contextMenu, showHeader }) => {
  const messageId = message._id || message.tempId;

  return (
    <div
      className={`relative max-w-[70%] border border-(--foreground-secondary)/20 py-1.5 px-0.5 flex flex-col ${
        isMe
          ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
          : "bg-(--bg-secondary) rounded-xl rounded-bl-none px-1.5"
      } ${message.isDeleted ? "cursor-default" : "cursor-pointer"}`}
      onContextMenu={(e) => contextMenu(e, messageId, message.isDeleted)}
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

      <div className={`${isMe ? "[&>div]:bg-(--bg-primary)/15" : ""}`}>
        {message.replyTo && <ReplyCard replyMessage={message.replyTo} />}
      </div>
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
  );
};

export default TextMessage;
