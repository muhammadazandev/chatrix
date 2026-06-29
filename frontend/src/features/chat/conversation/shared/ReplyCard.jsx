import { RiCloseLine } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import Motion from "../../../../motion/Motion";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import Tooltip from "../../../../components/Tooltip";
import { slideHeightExpand } from "../../../../motion/variants";

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
      className={`w-full rounded-sm bg-(--bg-primary)/40 flex cursor-pointer ${className}`}
      onClick={(e) => {
        if (e.target.tagName === "BUTTON") return;
        setJumpToMessageId(replyMessage._id);
      }}
    >
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
              : replyMessage?.text}
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
