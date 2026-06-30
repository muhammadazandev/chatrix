import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiPushpin2Line,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import { useEffect, useState } from "react";
import Tooltip from "../../../../components/Tooltip";
import useMessageUiStore from "../../../../store/useMessageUiStore";
import { slideHeightExpand } from "../../../../motion/variants";
import Motion from "../../../../motion/Motion";

const PinnedMessages = ({ pinnedMessages }) => {
  if (!pinnedMessages || pinnedMessages.length === 0) return null;

  const setJumpToMessageId = useMessageUiStore(
    (state) => state.setJumpToMessageId,
  );
  const [selectedMessage, setSelectedMessage] = useState(
    pinnedMessages.length - 1,
  ); // default latest first message

  useEffect(() => {
    setSelectedMessage(pinnedMessages.length - 1);
  }, [pinnedMessages]);

  useEffect(() => {
    if (selectedMessage >= pinnedMessages.length) {
      setSelectedMessage(Math.max(0, pinnedMessages.length - 1));
    }
  }, [pinnedMessages, selectedMessage]);

  const msg = pinnedMessages[selectedMessage];

  return (
    <Motion
      variants={slideHeightExpand}
      transition="subtle"
      className="px-4 py-3 border-b border-(--foreground-primary)/20"
    >
      <div className="flex justify-between gap-3">
        <div
          className="flex gap-4 items-center cursor-pointer flex-1 min-w-0"
          onClick={() => setJumpToMessageId(msg.message._id)}
        >
          <button className="p-1 rounded-md bg-(--bg-secondary)/50 shrink-0">
            <IconsWrapper icon={RiPushpin2Line} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-(--foreground-secondary)/60">
                Pinned by {msg?.pinnedBy?.username}
              </p>

              <p className="truncate">{msg?.message?.text}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-center">
          <Tooltip content="Previous pin" delay={[500, 0]}>
            <button
              disabled={selectedMessage === 0}
              className="rounded-sm p-1"
              onClick={() =>
                setSelectedMessage((prev) => Math.max(0, prev - 1))
              }
            >
              <IconsWrapper icon={RiArrowUpSLine} size={20} />
            </button>
          </Tooltip>

          <p className="opacity-40 text-sm">
            {selectedMessage + 1}/{pinnedMessages.length}
          </p>

          <Tooltip content="Next pin" delay={[500, 0]}>
            <button
              disabled={selectedMessage + 1 === pinnedMessages.length}
              className="rounded-sm p-1"
              onClick={() =>
                setSelectedMessage((prev) =>
                  Math.min(pinnedMessages.length - 1, prev + 1),
                )
              }
            >
              <IconsWrapper icon={RiArrowDownSLine} size={20} />
            </button>
          </Tooltip>
        </div>
      </div>
    </Motion>
  );
};

export default PinnedMessages;
