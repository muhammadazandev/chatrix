import {
  RiDeleteBin3Line,
  RiEdit2Line,
  RiFileCopyLine,
} from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import Motion from "../../../../motion/Motion";
import { fade } from "../../../../motion/variants";
import useAuthStore from "../../../../store/useAuthStore";
import { useEffect, useState } from "react";
import ConfirmBox from "../../../../components/ConfirmBox";
import { AnimatePresence } from "motion/react";
import { SOCKET_EVENTS } from "../../../../socket/events";
import { socket } from "../../../../socket/socket";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

const actionButtons = [
  {
    icon: RiFileCopyLine,
    label: "Copy Message",
    actionFun: "handleCopy",
  },
  {
    icon: RiEdit2Line,
    label: "Edit Message",
    actionFun: "handleEdit",
  },
  {
    icon: RiDeleteBin3Line,
    label: "Delete Message",
    actionFun: "handleDelete",
    danger: true,
  },
];

const OptionsMenu = ({
  message,
  coords,
  isMe,
  onClose,
  setMessageInput,
  setEditingMessage,
}) => {
  const user = useAuthStore((state) => state.user);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(message.text);
      onClose();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleEdit = () => {
    setEditingMessage(message);
    setMessageInput(message.text);
    onClose();
  };

  const handleOnConfirmDelete = () => {
    socket.emit(
      SOCKET_EVENTS.DELETE_MESSAGE,
      { messageId: message._id },
      (res) => {
        if (!res?.success) {
          toast.error(
            `Failed to delete message${res?.message ? `: ${res.message}` : ""}`,
          );
        }
      },
    );

    setIsConfirmOpen(false);
    onClose();
  };

  const actions = {
    handleCopy: handleCopy,
    handleEdit: handleEdit,
    handleDelete: () => setIsConfirmOpen(true),
  };

  useEffect(() => {
    window.addEventListener("click", onClose);

    window.addEventListener("scroll", onClose, true);

    return () => {
      window.removeEventListener("click", onClose);
      window.removeEventListener("scroll", onClose, true);
    };
  }, []);

  return createPortal(
    <Motion
      variants={fade}
      transition="spring"
      onClick={(e) => e.stopPropagation()}
      style={{ top: `${coords.y}px`, left: `${coords.x}px` }}
      className={`absolute z-99 rounded-xl py-1.5 w-40 top-1/2 -translate-y-1/2 bg-(--bg-secondary) border border-(--foreground-secondary)/20 ${isMe ? "-translate-x-full" : ""}`}
    >
      {actionButtons.map((btn) => {
        const isMine = message.senderId === user._id;
        if (
          (btn.actionFun === "handleEdit" &&
            (Date.now() - new Date(message.createdAt).getTime() > 900000 ||
              !isMine)) ||
          (btn.actionFun === "handleDelete" && !isMine)
        )
          return;

        return (
          <>
            {btn.actionFun === "handleDelete" ? (
              <div className="h-[0.1px] my-2 bg-(--foreground-primary)/20" />
            ) : null}
            <button
              onClick={actions[btn.actionFun]}
              key={btn.label}
              className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center gap-2.5 text-(--foreground-primary) ${btn.danger ? "text-red-300 hover:bg-red-500/10" : ""}`}
            >
              <IconsWrapper
                icon={btn.icon}
                size={15}
                className={btn.actionFun === "handleCopy" ? "rotate-180" : ""}
              />
              {btn.label}
            </button>
          </>
        );
      })}

      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmBox
            confirmWhat="deleteMessage"
            setIsConfirmOpen={setIsConfirmOpen}
            onConfirm={handleOnConfirmDelete}
          />
        )}
      </AnimatePresence>
    </Motion>,
    document.body,
  );
};

export default OptionsMenu;
