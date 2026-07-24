function convertFilesSize(sizeInBytes) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

const formatTime = (date, isMonthYearDay = false) => {
  if (!isMonthYearDay) {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return new Date(date).toLocaleTimeString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

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
    return `${icons[messageType]} ${text} (${messageType})`;
  }

  return `${icons[messageType]} ${labels[messageType]}`;
}

export { convertFilesSize, formatTime, formatDuration, mediaMessageText };
