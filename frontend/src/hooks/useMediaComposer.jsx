import useMessageUiStore from "../store/useMessageUiStore";
import { authApi } from "../utils/api";
import handleError from "../utils/handleError";
import toast from "react-hot-toast";

const useMediaComposer = () => {
  const addPendingMessage = useMessageUiStore(
    (state) => state.addPendingMessage,
  );
  const updatePendingMessage = useMessageUiStore(
    (state) => state.updatePendingMessage,
  );
  const removePendingMessage = useMessageUiStore(
    (state) => state.removePendingMessage,
  );

  async function sendMessage({
    conversationId,
    file,
    previewUrl,
    text = "",
    oldTempId = null,
    isRetry = false,
    isForward,
  }) {
    if (!file) return;

    const mime = file.type;

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
      const tempId = crypto.randomUUID();

      formData.append("file", file);

      formData.append(
        "message",
        JSON.stringify({
          conversationId,
          text,
          type: messageType,
          isForward: isForward ?? false,
        }),
      );

      const pendingMessage = {
        tempId,
        conversationId,
        status: "uploading",
        progress: 0,

        messageType,
        file: file,

        media: {
          url: previewUrl,
          fileName: file.name,
          size: file.size,
        },

        text,
        createdAt: Date.now(),
      };

      if (!isRetry) {
        addPendingMessage(pendingMessage);
      } else {
        updatePendingMessage(oldTempId, {
          status: "uploading",
          progress: 0,
          error: null,
        });
      }

      let lastProgress = 0;

      const request = authApi.post("/message/media", formData, {
        onUploadProgress(e) {
          if (!e.total) return;

          const progress = Math.round((e.loaded * 100) / e.total);

          if (progress !== lastProgress) {
            lastProgress = progress;
            updatePendingMessage(oldTempId ?? tempId, { progress });
          }
        },
      });

      request
        .then(() => {
          removePendingMessage(oldTempId ?? tempId);
        })
        .catch((error) => {
          updatePendingMessage(oldTempId ?? tempId, {
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
