import { AnimatePresence } from "motion/react";
import ReplyCard from "../shared/ReplyCard";

const MessageReply = ({
  messageMode,
  clearMessageMode,
}) => {
  return (
    <AnimatePresence>
      {messageMode.type === "reply" && (
        <ReplyCard
          replyMessage={messageMode.payload}
          showCloseButton
          onClose={clearMessageMode}
          animated
        />
      )}
    </AnimatePresence>
  );
};

export default MessageReply;