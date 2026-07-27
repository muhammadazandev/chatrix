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
        }),
      );

      const pendingMessage = {
        tempId,
        conversationId,
        status: "uploading",
        progress: 0,

        messageType,

        media: {
          url: previewUrl,
          fileName: file.name,
          size: file.size,
        },

        text,
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

      request
        .then(() => {
          removePendingMessage(tempId);
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
