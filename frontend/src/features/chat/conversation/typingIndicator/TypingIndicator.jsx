import { useSearchParams } from "react-router-dom";
import useChatStore from "../../../../store/useChatStore";
import { AnimatePresence, motion } from "motion/react";
import { fade } from "../../../../motion/variants";
import Motion from "../../../../motion/Motion";
import { useEffect } from "react";

const TypingIndicator = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const typingUsers = useChatStore(
    (state) => state.typingUsersByConversation[conversationId],
  );

  useEffect(() => {
    console.log(typingUsers);
  }, [typingUsers]);

  function showTypingIndicator() {
    if (!typingUsers || typingUsers.length === 0) return null;

    if (typingUsers.length === 1) {
      return (
        <Motion
          className="max-w-fit rounded-md py-1 px-3 bg-(--bg-secondary)"
          variants={fade}
        >
          {[1, 2, 3].map((dot) => (
            <motion.span
              key={dot}
              animate={{ y: [0, -3, 0] }}
              transition={{
                delay: dot * 0.15,
                repeat: Infinity,
                repeatDelay: 0.45,
                repeatType: "reverse",
              }}
              className="p-0.75 rounded-full bg-gray-400 inline-block mx-0.75"
            ></motion.span>
          ))}
        </Motion>
      );
    }
  }

  return (
    <div className="px-5 py-5">
      <AnimatePresence>{showTypingIndicator()}</AnimatePresence>
    </div>
  );
};

export default TypingIndicator;
