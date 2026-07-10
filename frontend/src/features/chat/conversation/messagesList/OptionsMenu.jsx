import {
  RiCornerUpLeftLine,
  RiDeleteBin3Line,
  RiEdit2Line,
  RiFileCopyLine,
  RiPushpin2Line,
  RiShareForwardLine,
} from "@remixicon/react";

import { AnimatePresence } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";

import ContextMenu from "../../../../components/ContextMenu";
import ConfirmBox from "../../../../components/ConfirmBox";

import useAuthStore from "../../../../store/useAuthStore";
import useChatStore from "../../../../store/useChatStore";
import useMessageUiStore from "../../../../store/useMessageUiStore";

import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";

const MessageOptionsMenu = ({ message, coords, isMe, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const pinnedMessages = useChatStore((state) => state.pinnedMessages);

  const setMessageMode = useMessageUiStore((state) => state.setMessageMode);
  const setForwardMessageId = useMessageUiStore(
    (state) => state.setForwardMessageId,
  );

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isMine = message.senderId === user._id;

  const isPinned = pinnedMessages.some(
    (msg) => msg.message._id === message._id,
  );

  const pin = pinnedMessages.find((msg) => msg.message._id === message._id);

  const canUnpin = !pin || pin.pinnedBy._id === user._id;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      toast.success("Message copied successfully");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handlePin = () => {
    const data = {
      messageId: message._id,
      conversationId: message.conversationId,
    };

    socket.emit(
      isPinned ? SOCKET_EVENTS.UNPIN_MESSAGE : SOCKET_EVENTS.PIN_MESSAGE,
      data,
      (res) => {
        if (!res?.success) {
          toast.error(res?.message || "Something went wrong");
        }
      },
    );
  };

  const handleDelete = () => {
    socket.emit(
      SOCKET_EVENTS.DELETE_MESSAGE,
      { messageId: message._id },
      (res) => {
        if (!res?.success) {
          toast.error(res?.message || "Something went wrong");
        }
      },
    );

    setIsConfirmOpen(false);
    onClose();
  };

  const items = [
    {
      label: "Copy Message",
      icon: RiFileCopyLine,
      iconClassName: "rotate-180",
      onClick: handleCopy,
    },
    {
      label: "Edit Message",
      icon: RiEdit2Line,
      hidden:
        !isMine || Date.now() - new Date(message.createdAt).getTime() > 900000,
      onClick: () =>
        setMessageMode({
          type: "edit",
          payload: message,
        }),
    },
    {
      label: "Reply",
      icon: RiCornerUpLeftLine,
      onClick: () =>
        setMessageMode({
          type: "reply",
          payload: message,
        }),
    },
    {
      label: "Forward Message",
      icon: RiShareForwardLine,
      onClick: () => setForwardMessageId(message._id),
    },
    {
      label: isPinned ? "Unpin Message" : "Pin Message",
      icon: RiPushpin2Line,
      hidden: isPinned && !canUnpin,
      onClick: handlePin,
    },
    {
      label: "Delete Message",
      icon: RiDeleteBin3Line,
      danger: true,
      separator: true,
      hidden: !isMine,
      keepOpen: true,
      onClick: () => setIsConfirmOpen(true),
    },
  ];

  return (
    <>
      <ContextMenu
        coords={coords}
        items={items}
        alignRight={isMe}
        onClose={onClose}
      />

      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmBox
            confirmWhat="deleteMessage"
            setIsConfirmOpen={setIsConfirmOpen}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MessageOptionsMenu;
