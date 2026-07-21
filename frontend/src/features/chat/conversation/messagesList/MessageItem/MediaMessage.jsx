import { RiLoader4Line, RiPlayLine, RiVideoOnFill } from "@remixicon/react";
import IconsWrapper from "../../../../../components/IconsWrapper";
import {
  formatDuration,
  formatTime,
} from "../../../../../utils/messagesHelpers";
import useMessageUiStore from "../../../../../store/useMessageUiStore";
import useChatStore from "../../../../../store/useChatStore";

const MediaMessage = ({ isMe, isPending, message }) => {
  const openMediaViewer = useMessageUiStore((state) => state.openMediaViewer);
  const messages = useChatStore((state) => state.messages);

  function handleOnMediaClick() {
    if (!isPending) {
      const allMedia = messages.filter(
        (msg) => msg.messageType === "image" || msg.messageType === "video",
      );

      openMediaViewer(allMedia, allMedia.indexOf(message));
    }
  }

  return (
    <div
      className={`relative max-w-[40%] border border-(--foreground-secondary)/20 p-2 flex flex-col gap-2 ${
        isMe || isPending
          ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
          : "bg-(--bg-secondary) rounded-xl rounded-bl-none"
      }`}
    >
      {isPending && (
        <div className="absolute inset-0 z-10 rounded-xl bg-black/45 flex flex-col items-center justify-center gap-2">
          <RiLoader4Line className="size-8 animate-spin text-white" />

          <span className="text-xs text-white/80">{message.progress}%</span>
        </div>
      )}

      {(message.messageType === "image" || message.messageType === "video") && (
        <>
          {message.messageType === "video" && !isPending ? (
            <img
              src={message.media.thumbnailUrl || message.media.url}
              alt="Image"
              className="max-w-full rounded-lg max-h-80 object-cover cursor-pointer"
              onClick={handleOnMediaClick}
            />
          ) : (
            <video src={message.media.url}></video>
          )}

          {message.messageType === "video" && !isPending && (
            <>
              <div className="absolute top-1/3 left-1/2 -translate-y-1/3 -translate-x-1/2">
                <button
                  className="hover:scale-110 rounded-full p-4 bg-(--bg-primary)/50 backdrop-blur-xl"
                  onClick={handleOnMediaClick}
                >
                  <IconsWrapper icon={RiPlayLine} size={28} />
                </button>
              </div>

              <div className="absolute bottom-15 py-1 left-5 pl-2 flex gap-2">
                <IconsWrapper icon={RiVideoOnFill} size={15} />
                <span className="text-xs">
                  {formatDuration(message.media.duration)}
                </span>
              </div>
            </>
          )}
        </>
      )}

      {message.messageType === "audio" && (
        <audio src={message.media.url} controls />
      )}
      {message.messageType === "file" && (
        <a
          href={message.media.url}
          target="_blank"
          rel="noreferrer"
          className="underline break-all"
        >
          {message.media.fileName || "Download file"}
        </a>
      )}
      <div
        className={`flex items-center gap-2 py-2 border-t border-(--foreground-secondary)/20 ${message.text ? "justify-between" : "justify-end"}`}
      >
        {message.text && (
          <span className="text-sm leading-relaxed whitespace-pre-wrap mr-12 break-all">
            {message.text}
          </span>
        )}
        <span className="text-[10px] opacity-40">
          {message.createdAt ? formatTime(message.createdAt) : ""}
        </span>
      </div>
    </div>
  );
};

export default MediaMessage;
