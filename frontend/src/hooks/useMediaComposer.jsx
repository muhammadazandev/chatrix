import useMessageUiStore from "../store/useMessageUiStore";
import { authApi } from "../utils/api";
import handleError from "../utils/handleError";
import { useQueryParams } from "./useQueryParams";
import toast from "react-hot-toast";

const useMediaComposer = ({ value }) => {
  const { searchParams } = useQueryParams();

  const mediaPreviewInfo = useMessageUiStore((state) => state.mediaPreviewInfo);
  const addPendingMessage = useMessageUiStore(
    (state) => state.addPendingMessage,
  );
  const updatePendingMessage = useMessageUiStore(
    (state) => state.updatePendingMessage,
  );
  const removePendingMessage = useMessageUiStore(
    (state) => state.removePendingMessage,
  );
  const setMediaPreviewInfo = useMessageUiStore(
    (state) => state.setMediaPreviewInfo,
  );

  async function sendMessage() {
    if (!mediaPreviewInfo?.file) return;

    const mime = mediaPreviewInfo.file.type;

    let messageType = "file";

    if (mime.startsWith("image/")) {
      messageType = "image";
    } else if (mime.startsWith("video/")) {
      messageType = "video";
    } else if (mime.startsWith("audio/")) {
      messageType = "audio";
    }

    try {
      const formData = new FormData();
      const conversationId = searchParams.get("conversationId");
      const tempId = crypto.randomUUID();

      formData.append("file", mediaPreviewInfo.file);

      formData.append(
        "message",
        JSON.stringify({
          conversationId,
          text: value,
          // replyTo,
          type: messageType,
        }),
      );

      const pendingMessage = {
        tempId,
        conversationId,
        status: "uploading",
        progress: 0,

        messageType,

        media: {
          url: mediaPreviewInfo?.url,
          fileName: mediaPreviewInfo.file.name,
          size: mediaPreviewInfo.file.size,
        },

        text: value,
        createdAt: Date.now(),
      };

      addPendingMessage(pendingMessage);

      let lastProgress = 0;

      const request = authApi.post("/message/media", formData, {
        onUploadProgress(e) {
          if (!e.total) return;

          const progress = Math.round((e.loaded * 100) / e.total);

          if (progress !== lastProgress) {
            lastProgress = progress;
            updatePendingMessage(tempId, { progress });
          }
        },
      });

      const preview = mediaPreviewInfo;

      setMediaPreviewInfo(null);

      request
        .then(() => {
          removePendingMessage(tempId);

          if (preview?.url) {
            URL.revokeObjectURL(preview?.url);
          }
        })
        .catch((error) => {
          updatePendingMessage(tempId, {
            status: "failed",
            error: handleError(error),
          });
          const message = handleError(error);
          if (message) toast.error(message);
        });
    } catch (error) {
      const message = handleError(error);
      if (message) toast.error(message);
    }
  }

  return { sendMessage };
};

export default useMediaComposer;
