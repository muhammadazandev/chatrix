import { RiLoader4Line } from "@remixicon/react";

const UploadStatus = ({
  status,
  progress = 0,
  variant = "overlay",
  onRetry,
  onCancel,
  onRemove,
}) => {
  const overlay = variant === "overlay";

  const containerClass = overlay
    ? "absolute inset-0 z-10 rounded-xl bg-black/45 flex flex-col items-center justify-center gap-3"
    : "mt-2 rounded-md border border-red-500/20 bg-red-500/10 p-2";

  if (status === "uploading") {
    return (
      <div className={containerClass}>
        <RiLoader4Line
          className={`animate-spin ${overlay ? "size-8 text-white" : "size-5"}`}
        />

        <span
          className={overlay ? "text-xs text-white/80" : "text-xs opacity-70"}
        >
          Uploading... {progress}%
        </span>

        {onCancel && (
          <button
            className={
              overlay
                ? "text-xs text-white/90 hover:underline no-hover"
                : "text-xs hover:underline no-hover"
            }
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className={containerClass}>
        <p className={overlay ? "text-sm text-white" : "text-xs text-red-300"}>
          Upload failed
        </p>

        <div className="flex items-center gap-4">
          {onRetry && (
            <button
              className={
                overlay
                  ? "text-sm font-medium text-(--accent-color-primary) hover:underline no-hover"
                  : "text-xs font-medium text-(--accent-color-primary) hover:underline no-hover"
              }
              onClick={onRetry}
            >
              Retry
            </button>
          )}

          {onRemove && (
            <button
              className={
                overlay
                  ? "text-sm text-red-300 hover:underline no-hover"
                  : "text-xs text-red-400 hover:underline no-hover"
              }
              onClick={onRemove}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default UploadStatus;
