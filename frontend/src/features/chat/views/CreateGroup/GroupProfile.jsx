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
import { useRef } from "react";
import useChatStore from "../../../../store/useChatStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import toast from "react-hot-toast";

const GroupProfile = ({ selectedFriends, setIsGroupProfile }) => {
  const {
    value,
    setValue,
    isOpen,
    handleEmojiSelect,
    closePicker,
    togglePicker,
  } = useEmojiPicker("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("default");
  const inputRef = useRef(null);
  const createGroup = useChatStore((state) => state.createGroup);
  const isLoading = useChatStore((state) => state.isLoading);
  const { updateParams } = useQueryParams();

  async function updatePicture(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setImageUrl(URL.createObjectURL(file));
  }

  async function handleCreateGroup() {
    const trimmedValue = value.trim();

    // Validation
    if (!trimmedValue) return toast.error("Please add a group name");
    if (selectedFriends.length < 1)
      return toast.error("Not enough members to create group");
    if (trimmedValue.length > 50 || trimmedValue.length < 3) {
      return toast.error("Group name must be between 3 and 50 characters.");
    }

    const formData = new FormData();

    formData.append("name", trimmedValue);

    if (file) {
      formData.append("profilePicture", file);
    } else {
      formData.append("avatar", "default");
    }
    const membersIdString = selectedFriends.map((obj) => obj._id);

    formData.append("membersIdString", JSON.stringify(membersIdString));

    await createGroup(formData, updateParams);
  }

  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl !== "default" && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

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
            loading="lazy"
            src={
              imageUrl === "default"
                ? "https://res.cloudinary.com/dbzdwitoa/image/upload/q_auto/f_auto/v1778327421/contact-dark-mode-glyph-ui-icon-address-book-profile-page-user-interface-design-white-silhouette-symbol-on-black-space-solid-pictogram-for-web-mobile-isolated-illustration-vector_sjfa4p.jpg"
                : imageUrl
            }
            alt="Group picture"
            className="rounded-full h-35 w-35 object-cover shadow-[0_5px_10px_var(--bg-secondary)] cursor-pointer opacity-40 z-50"
            onClick={() => {
              if (!inputRef?.current) return;
              inputRef.current.click();
            }}
          />

          <input
            type="file"
            accept="image/*"
            className="opacity-0 pointer-events-none -z-50 absolute"
            ref={inputRef}
            onChange={(e) => updatePicture(e)}
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
              maxLength={50}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateGroup();
              }}
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
          className={`mt-15 w-[90%] ml-3 py-2 rounded-sm self-start bg-(--accent-color-primary) ${value.length > 2 ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-50"}`}
          onClick={handleCreateGroup}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </Motion>
  );
};

export default GroupProfile;
