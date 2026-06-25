import { useEffect, useRef, useState } from "react";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import MessageItem from "./MessageItem";

const MessagesList = ({ messages }) => {
  const messageRefs = useRef({});
  const [openMessageMenuId, setOpenMessageMenuId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ x: 0, y: 0 });
  const jumpToMessageId = useMessageUiStore((state) => state.jumpToMessageId);
  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || jumpToMessageId) return;

    messageRefs.current[lastMessage._id]?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const replyToElement = messageRefs.current[jumpToMessageId];

    if (!replyToElement) return;

    replyToElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    const tm = setTimeout(() => {
      setJumpToMessageId(null);
    }, 1000);

    return () => clearTimeout(tm);
  }, [jumpToMessageId, setJumpToMessageId]);

  useEffect(() => {
    const closeMenu = () => setOpenMessageMenuId(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  function contextMenu(e, messageId, isDeleted) {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleted) return;

    setMenuCoords({
      x: e.clientX,
      y: e.clientY,
    });

    setOpenMessageMenuId(messageId);
  }

  const closeMenu = () => setOpenMessageMenuId(null)

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-transparent">
      <div className="flex flex-col px-4 py-6 gap-2">
        {messages.map((message, index) => {
          return (
            <MessageItem
              key={message._id}
              message={message}
              contextMenu={contextMenu}
              prevMessage={messages[index - 1]}
              openMessageMenuId={openMessageMenuId}
              messageRefs={messageRefs}
              menuCoords={menuCoords}
              closeMenu={closeMenu}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MessagesList;
