import { RiForbidLine, RiShareForwardLine } from "@remixicon/react";
import IconsWrapper from "./IconsWrapper";

function ForwardIndicator(isMe = false) {
  return (
    <div
      className={`flex items-center gap-1 px-2 pt-1 ${
        isMe ? "text-white/70" : "text-(--foreground-secondary)"
      }`}
    >
      <IconsWrapper
        icon={RiShareForwardLine}
        size={13}
        className="opacity-70"
      />

      <span className="text-[11px] italic opacity-70 select-none">
        Forwarded
      </span>
    </div>
  );
}

function DeleteIndicator() {
  return (
    <div className="flex gap-2 items-center">
      <IconsWrapper icon={RiForbidLine} className="opacity-50" size={20} />

      <p className="text-sm opacity-70 italic mr-14">
        This message was deleted
      </p>
    </div>
  );
}

function EditIndicator() {
  return <span className="text-[10px] opacity-40">Edited</span>;
}

export { ForwardIndicator, DeleteIndicator, EditIndicator};
