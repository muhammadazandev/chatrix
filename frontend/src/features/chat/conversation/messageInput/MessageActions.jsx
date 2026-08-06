import {
  RiCloseLine,
  RiEmotionHappyLine,
  RiMicLine,
  RiSendPlane2Fill,
} from "@remixicon/react";

import IconsWrapper from "../../../../components/IconsWrapper";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";
import Tooltip from "../../../../components/Tooltip";
import MediaMessagesButtons from "./MediaMessagesButtons";
import useAudioComposer from "../../../../hooks/useAudioComposer";

const MessageActions = ({
  side,
  isOpen,
  togglePicker,
  handleEmojiSelect,
  closePicker,
  messageMode,
  cancelEditing,
  sendMessage,
  value,
}) => {
  const { startRecording } = useAudioComposer();

  if (side === "left") {
    return (
      <div className="flex gap-1 shrink-0">
        <MediaMessagesButtons />
        <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
          <button className="p-2 rounded-full z-50" onClick={togglePicker}>
            <IconsWrapper icon={RiEmotionHappyLine} size={22} />
          </button>
        </Tooltip>

        <SharedEmojiPicker
          isOpen={isOpen}
          handleEmojiSelect={handleEmojiSelect}
          closePicker={closePicker}
          classes="absolute origin-bottom-left bottom-25 left-2"
        />
      </div>
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
        content={`${!value?.length > 0 ? "Record Audio" : messageMode.type === "edit" ? "Edit Message" : "Send Message"}`}
        delay={[1000, 0]}
      >
        <button
          className="p-3 bg-(--accent-color-primary) rounded-full shrink-0 z-50 max-h-fit"
          onClick={value?.length > 0 ? sendMessage : startRecording}
        >
          <IconsWrapper
            icon={value?.length > 0 ? RiSendPlane2Fill : RiMicLine}
            size={18}
          />
        </button>
      </Tooltip>
    </>
  );
};

export default MessageActions;
