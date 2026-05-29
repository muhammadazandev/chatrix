import { RiSendPlane2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";

const MessageInput = () => {
  return (
    <div className="mb-5 bg-(--bg-primary) px-5">
      <div className="w-full rounded-full bg-(--bg-secondary) py-2 pl-5 pr-2 flex gap-4">
        <input
          type="text"
          placeholder="Enter Your Message"
          className="w-full"
        />

        <button className="p-3 bg-(--accent-color-primary) rounded-full">
          <IconsWrapper icon={RiSendPlane2Fill} size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
