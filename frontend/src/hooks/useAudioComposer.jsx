import { useRef, useState } from "react";

function useAudioComposer() {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const compiledFileRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      chunksRef.current = [];

      let options = { mimeType: "audio/webm" };

      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        options = { mimeType: "audio/mp4" };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType;
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";

        compiledFileRef.current = new File([blob], `voice.${ext}`, {
          type: mimeType,
        });

        setAudioPreviewUrl(URL.createObjectURL(blob));
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Audio Composer failed to access microphone:", err);
    }
  };

  const stopRecording = () => {
    if (
      !mediaRecorderRef.current ||
      mediaRecorderRef.current.status === "inactive"
    )
      return;
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const clearComposer = () => {
    setAudioPreviewUrl(null);
    compiledFileRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
  };

  return {
    isRecording,
    isSending,
    audioPreviewUrl,
    startRecording,
    stopRecording,
    clearComposer,
  };
}

export default useAudioComposer;
