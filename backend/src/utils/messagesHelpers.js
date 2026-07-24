function mediaMessageText(messageText, messageType) {
  const icons = {
    image: "📷",
    video: "🎥",
    audio: "🎵",
    file: "📄",
  };

  const labels = {
    image: "Photo",
    video: "Video",
    audio: "Audio",
    file: "File",
  };

  const text = messageText?.trim();

  if (text) {
    return `${icons[messageType]} ${text}`;
  }

  return `${icons[messageType]} ${labels[messageType]}`;
}

export { mediaMessageText };
