import { Fragment, useEffect, useRef, useState } from "react";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import MessageItem from "./MessageItem";
import PendingMessages from "./PendingMessages";

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

  const closeMenu = () => setOpenMessageMenuId(null);

  function getDateLabel(messageDate) {
    const today = new Date();
    const message = new Date(messageDate);

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const messageOnly = new Date(
      message.getFullYear(),
      message.getMonth(),
      message.getDate(),
    );

    const diffInDays = (todayOnly - messageOnly) / (1000 * 60 * 60 * 24);

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    return message.toLocaleDateString();
  }

  function isDifferentDate(currentDate, previousDate) {
    if (!previousDate) return true;

    const current = new Date(currentDate);
    const previous = new Date(previousDate);

    return (
      current.getFullYear() !== previous.getFullYear() ||
      current.getMonth() !== previous.getMonth() ||
      current.getDate() !== previous.getDate()
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-transparent">
      <div className="flex flex-col px-4 py-6 gap-2">
        {messages.map((message, index) => {
          const showDateHeader = isDifferentDate(
            message.createdAt,
            messages[index - 1]?.createdAt,
          );

          return (
            <Fragment key={message._id}>
              {showDateHeader && (
                <div className="w-full flex justify-center opacity-90 tracking-wider my-2">
                  <p className="bg-(--bg-secondary)/50 rounded-md px-4 py-2 text-[12px]">
                    {getDateLabel(message.createdAt)}
                  </p>
                </div>
              )}
              <MessageItem
                message={message}
                contextMenu={contextMenu}
                prevMessage={messages[index - 1]}
                openMessageMenuId={openMessageMenuId}
                messageRefs={messageRefs}
                menuCoords={menuCoords}
                closeMenu={closeMenu}
              />
            </Fragment>
          );
        })}

        <PendingMessages />
      </div>
    </div>
  );
};

export default MessagesList;
