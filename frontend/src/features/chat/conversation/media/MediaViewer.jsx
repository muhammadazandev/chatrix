import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiChat1Line,
  RiCloseLine,
  RiVideoOnFill,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import Tooltip from "../../../../components/Tooltip";
import Motion from "../../../../motion/Motion";
import { fade } from "../../../../motion/variants";
import useAuthStore from "../../../../store/useAuthStore";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import { formatDuration, formatTime } from "../../../../utils/messagesHelpers";
import { useEffect, useMemo, useRef } from "react";

const MediaViewer = () => {
  const mediaViewer = useMessageUiStore((state) => state.mediaViewer);
  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );
  const updateMediaViewerIndex = useMessageUiStore(
    (state) => state.updateMediaViewerIndex,
  );
  const closeMediaViewer = useMessageUiStore((state) => state.closeMediaViewer);
  const user = useAuthStore((state) => state.user);

  const activeMedia = mediaViewer.items[mediaViewer.activeIndex] ?? {};
  const thumbnailRefs = useRef({});

  function goToMessage() {
    setJumpToMessageId(activeMedia._id);
    closeMediaViewer();
  }

  const actions = useMemo(
    () => [
      {
        label: "Go to message",
        Icon: RiChat1Line,
        click: goToMessage,
      },
      {
        label: "Close",
        Icon: RiCloseLine,
        click: closeMediaViewer,
      },
    ],
    [closeMediaViewer, activeMedia],
  );

  useEffect(() => {
    thumbnailRefs.current[activeMedia._id]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [mediaViewer.activeIndex]);

  useEffect(() => {
    function handleKeyboardNavigation(e) {
      if (e.key === "ArrowLeft" && mediaViewer.activeIndex > 0) {
        updateMediaViewerIndex(mediaViewer.activeIndex - 1);
      }
      if (
        e.key === "ArrowRight" &&
        mediaViewer.activeIndex < mediaViewer.items?.length - 1
      ) {
        updateMediaViewerIndex(mediaViewer.activeIndex + 1);
      }
      if (e.key === "Escape") {
        closeMediaViewer();
      }
    }

    window.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [
    mediaViewer.activeIndex,
    mediaViewer.items,
    updateMediaViewerIndex,
    closeMediaViewer,
  ]);

  return (
    <Motion
      variants={fade}
      className="overflow-hidden fixed top-0 left-0 w-full h-full bg-(--bg-primary) z-50 flex flex-col pt-5"
      transition="subtle"
    >
      <header className="flex justify-between px-7">
        <div className="flex gap-4">
          <img
            src={activeMedia.sender?.profilePicture}
            alt={activeMedia.sender?.username}
            className="rounded-full w-10 h-10 object-cover border border-(--foreground-secondary)/20"
          />

          <div>
            <h3 className="text-sm">
              {activeMedia.sender?._id === user._id
                ? "You"
                : activeMedia.sender?.username}
            </h3>

            <p className="text-xs opacity-50 pt-1">
              {formatTime(activeMedia.createdAt, true)}
            </p>
          </div>
        </div>

        <div>
          {actions.map((act) => {
            return (
              <Tooltip content={act.label} delay={[500, 0]} key={act.label}>
                <button className="p-1.5 rounded-full mx-1" onClick={act.click}>
                  <IconsWrapper icon={act.Icon} />
                </button>
              </Tooltip>
            );
          })}
        </div>
      </header>

      <main className="flex justify-between flex-1 items-center px-7">
        <button
          className="p-2 rounded-full bg-(--bg-secondary)"
          disabled={mediaViewer.activeIndex === 0}
          onClick={() => updateMediaViewerIndex(mediaViewer.activeIndex - 1)}
        >
          <IconsWrapper icon={RiArrowLeftSLine} />
        </button>

        <div className="flex flex-col items-center gap-8">
          {activeMedia.messageType === "video" ? (
            <video
              key={activeMedia._id}
              src={activeMedia.media?.url}
              controls
              className="max-w-[70vw] max-h-[65vh]"
            />
          ) : (
            <img
              key={activeMedia._id}
              src={activeMedia.media?.url}
              alt="Image"
              className="max-w-[70vw] max-h-[65vh] object-contain"
            />
          )}

          <p className="opacity-50">{activeMedia.media?.originalName}</p>
        </div>

        <button
          className="p-2 rounded-full bg-(--bg-secondary)"
          disabled={mediaViewer.activeIndex === mediaViewer.items?.length - 1}
          onClick={() => updateMediaViewerIndex(mediaViewer.activeIndex + 1)}
        >
          <IconsWrapper icon={RiArrowRightSLine} />
        </button>
      </main>

      <footer className="border-t border-(--foreground-primary)/30 pt-3">
        <div className="flex gap-5 pb-5 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-px-[calc(50%-40px)] justify-start">
          {mediaViewer.items?.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === mediaViewer.items.length - 1;

            return (
              <div
                key={item._id}
                className={`w-20 h-20 mt-1 rounded-sm overflow-hidden flex-none cursor-pointer relative transition-shadow duration-200 snap-center
                  ${isFirst ? "ml-[calc(50%-40px)]" : ""} 
                  ${isLast ? "mr-[calc(50%-40px)]" : ""}
                  ${mediaViewer.activeIndex === index ? "shadow-[0_0_0_2px_var(--accent-color-primary)]" : ""}
                `}
                onClick={() => updateMediaViewerIndex(index)}
                ref={(el) => {
                  if (el) {
                    thumbnailRefs.current[item._id] = el;
                  } else {
                    delete thumbnailRefs.current[item._id];
                  }
                }}
              >
                <img
                  src={item.media.thumbnailUrl || item.media.url}
                  alt="Image"
                  className="w-full h-full object-cover"
                />

                {item.messageType === "video" && (
                  <div className="absolute bottom-0 py-1 left-0 pl-2 flex gap-2 bg-(--bg-primary)/70 w-full">
                    <IconsWrapper icon={RiVideoOnFill} size={15} />
                    <span className="text-xs">
                      {formatDuration(item.media.duration)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </footer>
    </Motion>
  );
};

export default MediaViewer;
