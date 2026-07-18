import { RiLoader4Line } from "@remixicon/react";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useMessageUiStore from "../../../../store/useMessageUiStore";

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

const PendingMessages = () => {
  const pendingMessages = useMessageUiStore((state) => state.pendingMessages);
  const { searchParams } = useQueryParams();
  const conversationId = searchParams.get("conversationId");

  const conversationPendingMessages = pendingMessages.filter(
    (msg) => msg.conversationId === conversationId,
  );

  return (
    <div className="flex flex-col items-end gap-2">
      {conversationPendingMessages &&
        conversationPendingMessages.map((message) => {
          return (
            <div
              key={message.tempId}
              className="relative max-w-[40%] border border-(--foreground-secondary)/20 p-2 flex flex-col gap-2 not-odd:bg-linear-to-br from-(--accent-color-primary) to-(--accent-color-primary)/50 text-white rounded-xl rounded-br-none"
            >
              <div className="absolute inset-0 z-10 rounded-xl bg-black/45 flex flex-col items-center justify-center gap-2">
                <RiLoader4Line className="size-8 animate-spin text-white" />

                <span className="text-xs text-white/80">
                  {message.progress}%
                </span>
              </div>

              {message.messageType === "image" && (
                <img
                  src={message.media.url}
                  alt="Image"
                  className="max-w-full rounded-lg max-h-80 object-cover"
                />
              )}

              {message.messageType === "video" && (
                <video
                  src={message.media.url}
                  controls
                  className="max-w-full rounded-lg max-h-80"
                />
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

              <div className="flex justify-between items-center gap-2">
                {message?.text && <span>{message.text}</span>}
                <span className="text-[10px] opacity-40">
                  {message.createdAt ? formatTime(message.createdAt) : ""}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PendingMessages;
