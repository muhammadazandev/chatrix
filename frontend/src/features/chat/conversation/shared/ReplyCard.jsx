import { RiCloseLine, RiVideoOnFill } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import Motion from "../../../../motion/Motion";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import Tooltip from "../../../../components/Tooltip";
import { slideHeightExpand } from "../../../../motion/variants";
import {
  formatDuration,
  mediaMessageText,
} from "../../../../utils/messagesHelpers";

function renderMessageText(message) {
  if (!message) return;

  if (message.messageType !== "text") {
    return mediaMessageText(message.text, message.messageType);
  } else return message.text;
}

const ReplyCard = ({
  replyMessage,
  showCloseButton = false,
  onClose,
  animated = false,
  className = "",
}) => {
  const user = useAuthStore((state) => state.user);
  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );

  const content = (
    <div
      className={`w-full rounded-sm bg-(--bg-primary) flex cursor-pointer ${className} relative`}
      onClick={(e) => {
        if (e.target.tagName === "BUTTON") return;
        setJumpToMessageId(replyMessage._id);
      }}
    >
      <span className="bg-(--accent-color-secondary) w-1 rounded-l-full" />

      <div className="flex flex-1 items-center">
        <div className="min-w-0 flex-1 px-3 py-2">
          <p className="text-sm text-(--accent-color-secondary)">
            {replyMessage?.sender?._id?.toString() === user?._id?.toString()
              ? "You"
              : replyMessage?.sender?.username}
          </p>

          <p className="text-sm opacity-50 truncate">
            {replyMessage?.isDeleted
              ? "This message was deleted"
              : renderMessageText(replyMessage)}
          </p>
        </div>

        {showCloseButton && (
          <Tooltip content="Cancel" delay={[1000, 0]}>
            <button
              className="rounded-full max-w-fit max-h-fit p-2"
              onClick={onClose}
            >
              <IconsWrapper icon={RiCloseLine} />
            </button>
          </Tooltip>
        )}
      </div>

      {!replyMessage.isDeleted &&
        !showCloseButton &&
        (replyMessage.messageType === "image" ||
          replyMessage.messageType === "video") && (
          <div className="relative min-h-full w-full ml-10">
            <img
              className="h-full max-w-23 rounded-sm"
              src={replyMessage.media?.thumbnailUrl || replyMessage.media?.url}
              alt={replyMessage.messageType}
            />

            <div className="absolute inset-0 bg-black/35" />

            {replyMessage.messageType === "video" && (
              <div className="absolute left-2 bottom-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px]">
                <IconsWrapper icon={RiVideoOnFill} size={12} />
                <span className="text-[10px]">
                  {formatDuration(replyMessage.media?.duration)}
                </span>
              </div>
            )}
          </div>
        )}
    </div>
  );

  if (!animated) return content;

  return (
    <Motion
      className="mb-3 w-full z-10 overflow-hidden flex justify-center"
      variants={slideHeightExpand}
      transition="subtle"
    >
      {content}
    </Motion>
  );
};

export default ReplyCard;
