import { RiLoader4Line, RiPlayLine, RiVideoOnFill } from "@remixicon/react";
import IconsWrapper from "../../../../../components/IconsWrapper";
import {
  convertFilesSize,
  formatDuration,
  formatTime,
} from "../../../../../utils/messagesHelpers";
import useMessageUiStore from "../../../../../store/useMessageUiStore";
import useChatStore from "../../../../../store/useChatStore";
import { DeleteIndicator } from "../../../../../components/MessageIndicators";

const MediaMessage = ({ isMe, isPending, message, contextMenu }) => {
  const openMediaViewer = useMessageUiStore((state) => state.openMediaViewer);
  const messages = useChatStore((state) => state.messages);

  function handleOnMediaClick() {
    if (!isPending) {
      const allMedia = messages
        .filter(
          (msg) => msg.messageType === "image" || msg.messageType === "video",
        )
        .filter((msg) => !msg.isDeleted);

      openMediaViewer(allMedia, allMedia.indexOf(message));
    }
  }

  return (
    <div
      className={`relative max-w-[40%] border border-(--foreground-secondary)/20  flex flex-col ${message?.isDeleted ? "p-2" : message.messageType === "file" ? "p-0.5 pb-1" : "p-1 gap-2"} ${
        isMe || isPending
          ? "bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
          : "bg-(--bg-secondary) rounded-xl rounded-bl-none"
      }`}
      onContextMenu={(e) => contextMenu(e, message._id, message.isDeleted)}
    >
      {message?.isDeleted ? (
        <DeleteIndicator />
      ) : (
        <>
          {isPending && (
            <div className="absolute inset-0 z-10 rounded-xl bg-black/45 flex flex-col items-center justify-center gap-2">
              <RiLoader4Line className="size-8 animate-spin text-white" />

              <span className="text-xs text-white/80">{message.progress}%</span>
            </div>
          )}

          <div className="relative">
            {(message.messageType === "image" ||
              message.messageType === "video") && (
              <>
                {!isPending || message.messageType === "image" ? (
                  <img
                    src={message.media.thumbnailUrl || message.media.url}
                    alt="Image"
                    className="max-w-full rounded-lg max-h-80 object-cover cursor-pointer"
                    onClick={handleOnMediaClick}
                  />
                ) : (
                  <video
                    src={message.media.url}
                    className="w-full rounded-lg max-h-80 object-cover"
                  ></video>
                )}

                {message.messageType === "video" && !isPending && (
                  <>
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                      <button
                        className="hover:scale-110 rounded-full p-4 bg-(--bg-primary)/50 backdrop-blur-xl"
                        onClick={handleOnMediaClick}
                      >
                        <IconsWrapper icon={RiPlayLine} size={28} />
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-4 flex gap-2">
                      <IconsWrapper icon={RiVideoOnFill} size={15} />
                      <span className="text-xs">
                        {formatDuration(message.media.duration)}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {message.messageType === "audio" && (
            <audio src={message.media.url} controls />
          )}
          {message.messageType === "file" && (
            <div
              className="p-3 rounded-sm flex gap-2 items-center bg-(--bg-primary)/25 min-w-64 max-w-96 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="35"
                height="35"
                viewBox="0 0 48 48"
              >
                <path fill="#90CAF9" d="M40 45L8 45 8 3 30 3 40 13z"></path>
                <path fill="#E1F5FE" d="M38.5 14L29 14 29 4.5z"></path>
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-sm line-clamp-2 break-all">
                  {message.media?.originalName}
                </p>

                <div className="flex flex-col gap-4 opacity-50 text-xs">
                  <p className="uppercase">
                    {message.media?.originalName?.split(".").pop()} -{" "}
                    {convertFilesSize(message?.media?.size)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="relative pb-2">
            {message.text && (
              <span className="block text-sm leading-relaxed whitespace-pre-wrap break-all pr-12">
                {message.text}
              </span>
            )}
          </div>
        </>
      )}

      <div className="w-full flex justify-end">
        <span className="text-[10px] opacity-40">
          {message.createdAt ? formatTime(message.createdAt) : ""}
        </span>
      </div>
    </div>
  );
};

export default MediaMessage;
