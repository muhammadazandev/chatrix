import { RiCloseLine, RiEmotionHappyLine, RiFile3Line } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import Tooltip from "../../../../components/Tooltip";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import Motion from "../../../../motion/Motion";
import { fade } from "../../../../motion/variants";
import { convertFilesSize } from "../../../../utils/convertFilesSize";
import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";

const MediaPreviewModal = () => {
  const mediaPreviewInfo = useMessageUiStore((state) => state.mediaPreviewInfo);
  const setMediaPreviewInfo = useMessageUiStore(
    (state) => state.setMediaPreviewInfo,
  );
  const type = mediaPreviewInfo?.file?.type ?? "";
  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");

  return (
    <Motion
      variants={fade}
      className="overflow-hidden absolute top-0 left-0 min-w-full min-h-full bg-(--bg-primary) z-50 p-5 flex flex-col"
      transition="subtle"
    >
      {mediaPreviewInfo && (
        <>
          <header className="flex w-full">
            <Tooltip content="Cancel" delay={[500, 0]}>
              <button
                className="p-2 rounded-full"
                onClick={() => {
                  setMediaPreviewInfo(null);
                  URL.revokeObjectURL(mediaPreviewInfo?.url);
                }}
              >
                <IconsWrapper icon={RiCloseLine} />
              </button>
            </Tooltip>

            <div className="flex-1 flex justify-center items-center">
              <p className="">{mediaPreviewInfo?.file.name}</p>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full max-w-4xl flex items-center justify-center flex-col">
              {mediaPreviewInfo?.type === "media" ? (
                <>
                  {type.startsWith("image/") ? (
                    <img
                      src={mediaPreviewInfo?.url}
                      alt={mediaPreviewInfo?.file.name}
                      className="max-w-full max-h-[70vh] object-contain"
                    />
                  ) : (
                    <video src={mediaPreviewInfo?.url} controls></video>
                  )}
                </>
              ) : (
                <>
                  {type.startsWith("audio/") ? (
                    <audio controls src={mediaPreviewInfo?.url}></audio>
                  ) : (
                    <div className="w-105 rounded-2xl bg-(--bg-secondary) border border-(--foreground-primary)/30">
                      <div className="p-6 flex items-center gap-4 border-b border-(--foreground-primary)/30">
                        <div className="size-14 rounded-xl bg-(--accent-color-secondary)/15 flex items-center justify-center">
                          <RiFile3Line className="size-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            className="line-clamp-2 text-base font-medium"
                            title={mediaPreviewInfo?.file.name}
                          >
                            {mediaPreviewInfo?.file.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-[90px_1fr] gap-y-3 text-sm">
                          <span className="opacity-50">Size</span>
                          <span>
                            {convertFilesSize(mediaPreviewInfo?.file.size)}
                          </span>

                          <span className="opacity-50">Type</span>
                          <span className="truncate">{type.split("/")[1]}</span>
                        </div>

                        <div className="mt-6 rounded-lg bg-(--bg-primary)/40 px-4 py-3 text-sm opacity-70">
                          Preview isn't available for this file type.
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {!type.startsWith("audio/") && (
                <div className="flex-1 bg-(--bg-secondary) rounded-lg px-4 mt-15 flex justify-between py-2 items-center w-105">
                  <textarea
                    placeholder="Enter Caption"
                    className="w-full outline-none z-50 resize-none max-h-fit"
                    rows={1}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />

                  <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
                    <button
                      className="p-1 rounded-full z-50"
                      onClick={togglePicker}
                    >
                      <IconsWrapper icon={RiEmotionHappyLine} size={22} />
                    </button>
                  </Tooltip>

                  <SharedEmojiPicker
                    isOpen={isOpen}
                    handleEmojiSelect={handleEmojiSelect}
                    closePicker={closePicker}
                    classes="absolute origin-bottom-right bottom-15 right-2"
                  />
                </div>
              )}
            </div>
          </main>

          <footer>
            <div>
              <button></button>
            </div>
          </footer>
        </>
      )}
    </Motion>
  );
};

export default MediaPreviewModal;
