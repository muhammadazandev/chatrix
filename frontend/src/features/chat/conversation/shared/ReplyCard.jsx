import { RiCloseLine, RiVideoOnFill } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import Motion from "../../../../motion/Motion";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import Tooltip from "../../../../components/Tooltip";
import { slideHeightExpand } from "../../../../motion/variants";
import {
  formatDuration,
  getMediaText,
} from "../../../../utils/messagesHelpers";

function renderMessageText(message) {
  if (!message) return;

  if (message.messageType !== "text") {
    return getMediaText(message);
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
      {/* <div className="flex-1 flex"> */}
      <span className="bg-(--accent-color-secondary) w-1 rounded-l-full" />

      <div className="px-3 py-2 flex w-full justify-between">
        <div className="max-w-[95%]">
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
      {/* </div> */}

      {!showCloseButton &&
        (replyMessage.messageType === "image" ||
          replyMessage.messageType === "video") &&
        replyMessage?.isDeleted && (
          <div className="absolute right-0 top-0 h-full">
            <div className="absolute inset-0 bg-black opacity-50 rounded-sm"></div>

            <img
              className="h-full w-24 rounded-sm"
              src={replyMessage.media.thumbnailUrl || replyMessage.media.url}
              alt={replyMessage.messageType}
            />

            {replyMessage.messageType === "video" && (
              <div className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px]">
                <IconsWrapper icon={RiVideoOnFill} size={12} />
                <span className="text-[10px]">
                  {formatDuration(replyMessage.media.duration)}
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
