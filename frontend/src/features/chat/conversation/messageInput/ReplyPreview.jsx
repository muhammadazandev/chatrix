import { RiCloseLine } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import Motion from "../../../../motion/Motion";

const ReplyPreview = ({ message, clearMessageMode }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <Motion
      className="mb-3 w-full z-10 overflow-hidden flex justify-center"
      initial={{ height: 0, y: 5 }}
      animate={{ height: "auto", y: 0 }}
      exit={{ height: 0, y: 5 }}
      transition="subtle"
    >
      <div className="w-full h-15 rounded-sm bg-(--bg-primary)/40 flex">
        <span className="bg-(--accent-color-secondary) w-1 rounded-l-full h-full" />

        <div className="px-3 py-2 flex w-full justify-between">
          <div className="max-w-[95%]">
            <p className="text-sm text-(--accent-color-secondary)">
              {message.sender._id.toString() === user._id.toString()
                ? "You"
                : message.sender.username}
            </p>

            <p className="text-sm opacity-50">{message.text}</p>
          </div>

          <button
            className="rounded-full max-w-fit max-h-fit p-2"
            onClick={clearMessageMode}
          >
            <IconsWrapper icon={RiCloseLine} />
          </button>
        </div>
      </div>
    </Motion>
  );
};

export default ReplyPreview;
