import { useState } from "react";

const useEmojiPicker = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const togglePicker = () => setIsOpen((prev) => !prev);
  const closePicker = () => setIsOpen(false);

  const handleEmojiSelect = (emojiData) => {
    setValue((prev) => prev + emojiData.emoji);
  };

  return {
    value,
    setValue,
    isOpen,
    togglePicker,
    closePicker,
    handleEmojiSelect,
  };
};

export default useEmojiPicker;
