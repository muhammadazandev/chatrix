import ReplyCard from "../../shared/ReplyCard";
import { formatTime } from "../../../../../utils/messagesHelpers";
import {
  DeleteIndicator,
  EditIndicator,
  ForwardIndicator,
} from "../../../../../components/MessageIndicators";

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
      {message.isForwarded && <ForwardIndicator isMe={isMe} />}

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
          <DeleteIndicator />
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap mr-12 break-all">
            {message.text}
          </p>
        )}

        <div className="flex justify-end items-center gap-2">
          {message.isEdited && <EditIndicator />}

          <span className="text-[10px] opacity-40">
            {message.createdAt ? formatTime(message.createdAt) : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
