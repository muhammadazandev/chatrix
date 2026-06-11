import {
  RiArrowLeftLine,
  RiEmotionHappyLine,
  RiImageFill,
} from "@remixicon/react";
import Motion from "../../../../motion/Motion";
import { slideInFromLeft } from "../../../../motion/variants";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useEffect, useState } from "react";
import useEmojiPicker from "../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../components/SharedEmojiPicker";

const GroupProfile = ({ setIsGroupProfile }) => {
  const [imageUrl, setImageUrl] = useState(
    "https://res.cloudinary.com/dbzdwitoa/image/upload/q_auto/f_auto/v1778327421/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector_sjfa4p.jpg",
  );
  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");
  const [name, setName] = useState("");

  useEffect(() => {
    setName(value)
  }, [value])

  return (
    <Motion
      variants={slideInFromLeft}
      className="absolute top-0 h-screen w-[96%] z-100 bg-(--bg-primary) border-r border-(--foreground-primary)/20 py-5"
    >
      <button
        className="rounded-full p-2"
        onClick={() => setIsGroupProfile(false)}
      >
        <IconsWrapper icon={RiArrowLeftLine} />
      </button>

      <div className="flex items-center flex-col">
        <div className="flex mt-5 relative mr-5">
          <img
            src={imageUrl}
            alt="Group picture"
            className="rounded-full h-35 w-35 object-cover shadow-[0_5px_10px_var(--bg-secondary)] cursor-pointer opacity-40"
          />
          <div className="absolute w-35 h-35 flex items-center justify-center flex-col text-center gap-3 cursor-pointer">
            <IconsWrapper icon={RiImageFill} />
            <p className="text-[13px] max-w-[60%] leading-3.75 font-extrabold">
              Add Group Avatar
            </p>
          </div>
        </div>

        <div className="pr-8 pl-4 w-full relative">
          <div className="mt-15 w-full flex justify-between border-b border-(--foreground-primary)/20 pb-3">
            <input
              type="text"
              placeholder="Enter Group Name"
              className="flex-1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <button className="p-0.5 rounded-full" onClick={togglePicker}>
              <IconsWrapper icon={RiEmotionHappyLine} />
            </button>

            <SharedEmojiPicker
              isOpen={isOpen}
              handleEmojiSelect={handleEmojiSelect}
              closePicker={closePicker}
              classes="fixed left-[calc(100%_/_3.4)] origin-top-left"
            />
          </div>
        </div>

        <button
          className={`mt-15 w-[90%] ml-3 py-2 rounded-sm self-start bg-(--accent-color-primary) ${name.length > 0 ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-50"}`}
        >
          Create Group
        </button>
      </div>
    </Motion>
  );
};

export default GroupProfile;
