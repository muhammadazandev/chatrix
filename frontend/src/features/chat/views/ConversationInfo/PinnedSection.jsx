import toast from "react-hot-toast";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { socket } from "../../../../socket/socket";
import Tooltip from "../../../../components/Tooltip";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiPushpin2Line } from "@remixicon/react";
import { motion } from "motion/react";
import useAuthStore from "../../../../store/useAuthStore";
import useMessageUiStore from "../../../../store/useMessageUiStore";

const childVariants = {
  rest: {
    x: 30,
    opacity: 0,
    boxShadow: "0px 0 0px 0px transparent",
    backgroundColor: "transparent",
  },
  hover: {
    x: 0,
    opacity: 1,
    boxShadow: "-20px 0 25px 10px var(--bg-secondary)",
    backgroundColor: "var(--bg-secondary)",
  },
};

const PinnedSection = ({ currentConversation, pinnedMessages }) => {
  const user = useAuthStore((state) => state.user);
  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );

  function handleUnpin(e, messageId) {
    e.stopPropagation();
    socket.emit(
      SOCKET_EVENTS.UNPIN_MESSAGE,
      {
        messageId,
        conversationId: currentConversation._id,
      },
      (res) => {
        if (!res?.success) {
          toast.error(
            `${res?.message ? `${res.message}` : ""}`,
          );
        }
      },
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-3">
      {pinnedMessages.length > 0 ? (
        pinnedMessages.map((m) => (
          <motion.div
            key={m._id}
            initial="rest"
            whileHover="hover"
            className="w-full rounded-lg bg-(--bg-secondary)/30 px-4 py-3 pr-14 text-left cursor-pointer relative hover:bg-(--bg-secondary)/50 overflow-hidden"
            onClick={() => setJumpToMessageId(m.message._id)}
          >
            <div className="flex items-center gap-2 text-xs opacity-60">
              <IconsWrapper icon={RiPushpin2Line} size={14} />
              <span>
                Pinned by{" "}
                {m.pinnedBy._id === user._id ? "You" : m.pinnedBy.username}
              </span>
            </div>

            <p className="mt-2 text-sm line-clamp-2 wrap-break-word">
              {m.message.text}
            </p>

            {m.pinnedBy._id === user._id && (
              <div className="absolute right-0 top-0 bottom-0 flex items-center">
                <motion.div
                  variants={childVariants}
                  className="h-full px-4 flex items-center justify-center z-50"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                  }}
                >
                  <Tooltip content="Unpin">
                    <button
                      className="rounded-full p-2 no-hover hover:bg-(--bg-primary)"
                      onClick={(e) => handleUnpin(e, m.message._id)}
                    >
                      <IconsWrapper icon={RiPushpin2Line} size={20} />
                    </button>
                  </Tooltip>
                </motion.div>
              </div>
            )}
          </motion.div>
        ))
      ) : (
        <div className="w-full rounded-lg border-2 border-dashed border-(--bg-secondary) px-4 py-3 pr-14 mt-4">
          No pinned messages yet.
        </div>
      )}
    </div>
  );
};

export default PinnedSection;
