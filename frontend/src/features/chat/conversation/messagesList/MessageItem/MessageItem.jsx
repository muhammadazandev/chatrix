import { AnimatePresence } from "motion/react";
import useAuthStore from "../../../../../store/useAuthStore";
import OptionsMenu from "../OptionsMenu";
import SystemMessage from "./SystemMessage";
import TextMessage from "./TextMessage";
import MediaMessage from "./MediaMessage";

const MessageItem = ({
  message,
  contextMenu = () => {},
  prevMessage,
  openMessageMenuId,
  messageRefs = null,
  menuCoords = { x: 0, y: 0 },
  closeMenu = () => {},
  isPending = false,
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

  const messageId = message._id || message.tempId;

  function ReturnMessage() {
    if (message.messageType === "system") {
      return <SystemMessage message={message} />;
    } else if (message.messageType === "text") {
      return (
        <TextMessage
          isMe={isMe}
          message={message}
          contextMenu={contextMenu}
          showHeader={showHeader}
        />
      );
    } else {
      return (
        <MediaMessage isMe={isMe} isPending={isPending} message={message} />
      );
    }
  }

  return (
    <div
      ref={(el) => {
        if (messageId && messageRefs) {
          if (el) {
            messageRefs.current[messageId] = el;
          } else {
            delete messageRefs.current[messageId];
          }
        }
      }}
      className={`flex ${
        isMe || isPending ? "justify-end" : "justify-start"
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

      {<ReturnMessage />}

      <AnimatePresence>
        {openMessageMenuId === messageId && (
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
