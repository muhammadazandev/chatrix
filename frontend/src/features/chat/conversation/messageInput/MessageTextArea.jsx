const MessageTextArea = ({
  value,
  setValue,
  inputRef,
  handleTyping,
  sendMessage,
  cancelEditing,
}) => {
  return (
    <textarea
      placeholder="Enter Your Message"
      className="w-full outline-none bg-transparent z-50 resize-none max-h-25 min-h-5 py-2"
      ref={inputRef}
      rows={1}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handleTyping();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        } else if (e.key === "Escape") {
          cancelEditing();
        }
      }}
    />
  );
};

export default MessageTextArea;
