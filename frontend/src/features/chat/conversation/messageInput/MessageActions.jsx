import {
  RiCloseLine,
  RiEmotionHappyLine,
  RiSendPlane2Fill,
} from "@remixicon/react";

import IconsWrapper from "../../../../components/IconsWrapper";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";
import Tooltip from "../../../../components/Tooltip";

const MessageActions = ({
  side,
  isOpen,
  togglePicker,
  handleEmojiSelect,
  closePicker,
  messageMode,
  cancelEditing,
  sendMessage,
}) => {
  if (side === "left") {
    return (
      <>
        <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
          <button
            className="p-2 rounded-full shrink-0 z-50"
            onClick={togglePicker}
          >
            <IconsWrapper icon={RiEmotionHappyLine} size={25} />
          </button>
        </Tooltip>

        <SharedEmojiPicker
          isOpen={isOpen}
          handleEmojiSelect={handleEmojiSelect}
          closePicker={closePicker}
          classes="absolute origin-bottom-left bottom-25 left-2"
        />
      </>
    );
  }

  return (
    <>
      {messageMode.type === "edit" && (
        <Tooltip content="Cancel Editing" delay={[1000, 0]}>
          <button
            className="p-3 bg-(--bg-secondary) shrink-0 rounded-full border border-(--foreground-secondary)/10"
            onClick={cancelEditing}
          >
            <IconsWrapper icon={RiCloseLine} size={16} className="scale-120" />
          </button>
        </Tooltip>
      )}

      <Tooltip
        content={`${messageMode.type === "edit" ? "Edit" : "Send"} Message`}
        delay={[1000, 0]}
      >
        <button
          className="p-3 bg-(--accent-color-primary) rounded-full shrink-0 z-50 max-h-fit"
          onClick={sendMessage}
        >
          <IconsWrapper icon={RiSendPlane2Fill} size={18} />
        </button>
      </Tooltip>
    </>
  );
};

export default MessageActions;
