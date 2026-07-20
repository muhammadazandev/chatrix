import { useEffect, useMemo, useState } from "react";
import Tooltip from "../../../../components/Tooltip";
import { downloadFile } from "../../../../utils/downloadFile";
import {
  RiChat1Line,
  RiCloseLine,
  RiDownloadLine,
  RiRestartLine,
  RiZoomInLine,
  RiZoomOutLine,
} from "@remixicon/react";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import IconsWrapper from "../../../../components/IconsWrapper";
import { useControls } from "react-zoom-pan-pinch";

const MediaActions = ({ activeMedia, closeMediaViewer, mediaViewer }) => {
  const { zoomOut, zoomIn, resetTransform, instance } = useControls();
  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!instance) return;
    const unsubscribe = instance.onChange(() => {
      setScale(instance.state.scale);
    });

    return () => unsubscribe();
  }, [instance, activeMedia]);

  if (!activeMedia) return null;

  function goToMessage() {
    setJumpToMessageId(activeMedia._id);
    closeMediaViewer();
  }

  const isZoomed = scale > 1.01;

  const actions = useMemo(() => {
    const baseActions = [];

    if (activeMedia.messageType !== "video") {
      baseActions.push(
        {
          label: "Zoom In",
          Icon: RiZoomInLine,
          click: () => zoomIn(),
        },
        {
          label: "Zoom Out",
          Icon: RiZoomOutLine,
          click: () => zoomOut(),
        },
        {
          label: isZoomed ? "Reset Zoom" : "Normal Scale",
          disabled: !isZoomed,
          Icon: RiRestartLine,
          click: () => resetTransform(),
        },
      );
    }

    baseActions.push(
      {
        label: "Download",
        Icon: RiDownloadLine,
        click: () => {
          downloadFile(activeMedia.media?.url, activeMedia.media?.originalName);
        },
      },
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
    );

    return baseActions;
  }, [closeMediaViewer, activeMedia, zoomIn, zoomOut, resetTransform]);

  useEffect(() => {
    resetTransform();
  }, [mediaViewer.activeIndex]);

  useEffect(() => {
    function handleKeyboardNavigation(e) {
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetTransform();
    }

    window.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [
    mediaViewer.activeIndex,
    mediaViewer.items,
    closeMediaViewer,
    activeMedia,
    zoomIn,
    zoomOut,
    resetTransform,
  ]);

  return (
    <>
      {actions.map((act) => {
        return (
          <Tooltip content={act.label} delay={[500, 0]} key={act.label}>
            <button
              className={`p-1.5 rounded-full mx-1 transition-all duration-200
              `}
              onClick={act.click}
              disabled={act.disabled ?? false}
            >
              <IconsWrapper icon={act.Icon} size={20} />
            </button>
          </Tooltip>
        );
      })}
    </>
  );
};

export default MediaActions;
