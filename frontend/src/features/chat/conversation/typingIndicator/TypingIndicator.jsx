import { useSearchParams } from "react-router-dom";
import useChatStore from "../../../../store/useChatStore";
import { useShallow } from "zustand/react/shallow";
import { AnimatePresence, motion } from "motion/react";

const TypingIndicator = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const typingUsers =
    useChatStore(
      useShallow((state) => state.typingUsersByConversation[conversationId]),
    ) || [];

  const renderTextContent = () => {
    const totalCount = typingUsers.length;
    if (totalCount === 0) return "";

    const user1 = typingUsers[0]?.username || "Someone";
    const user2 = typingUsers[1]?.username;
    const user3 = typingUsers[2]?.username;

    if (totalCount === 1) return `${user1} is typing`;
    if (totalCount === 2) return `${user1} and ${user2} are typing`;
    if (totalCount === 3) return `${user1}, ${user2} and ${user3} are typing`;

    return `${user1}, ${user2} and ${totalCount - 2} others are typing`;
  };

  return (
    <div className="w-full mt-3 mb-2 px-8 block clear-both select-none">
      <AnimatePresence mode="wait">
        {typingUsers.length > 0 && (
          <motion.div
            key={`typing-session-${conversationId}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center gap-3.5 w-fit"
          >
            <div className="flex items-center -space-x-2.5 isolate">
              {typingUsers.slice(0, 3).map((user, idx) => (
                <div
                  key={user.userId || idx}
                  className="relative rounded-full p-0.5 shadow-sm"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    zIndex: 10 - idx,
                  }}
                >
                  <img
                    src={user.profilePicture || "default-avatar-url.png"}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </div>
              ))}
            </div>

            <span
              className="text-sm font-medium tracking-wide whitespace-nowrap"
              style={{ color: "var(--foreground-primary)", opacity: 0.7 }}
            >
              {renderTextContent()}
            </span>

            <div className="flex items-center gap-1 h-4 px-1">
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--foreground-primary)" }}
                ></motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypingIndicator;
