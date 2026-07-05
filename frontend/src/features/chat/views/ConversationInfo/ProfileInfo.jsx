import { RiCamera4Line, RiCheckLine, RiEdit2Line } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import IconsWrapper from "../../../../components/IconsWrapper";
import { authApi } from "../../../../utils/api";
import useAuthStore from "../../../../store/useAuthStore";
import { socket } from "../../../../socket/socket";

const ProfileInfo = ({ currentConversation }) => {
  const isDirect = currentConversation?.type === "direct";
  const pictureInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    currentConversation?.avatar || null,
  );
  const user = useAuthStore((state) => state.user);
  const userId = user._id;
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState(currentConversation?.name || "");
  const [isUpdatingNameActive, setIsUpdatingNameActive] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);

  const isAdminOrOwner =
    currentConversation?.type === "group" &&
    currentConversation?.roles[userId] !== "member";

  useEffect(() => {
    if (!currentConversation) return;
    setProfilePictureUrl(currentConversation.avatar);
    setName(currentConversation.name);
  }, [currentConversation]);

  async function updateProfilePicture(e) {
    if (!pictureInputRef.current) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    // Instant preview
    setProfilePictureUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await authApi.patch(
        `/group/update-profile-picture/${currentConversation._id}`,
        formData,
      );

      setProfilePictureUrl(res.data.avatar);

      toast.success(res.data.message || "Profile picture updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setProfilePictureUrl(currentConversation?.avatar);
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    if (isUpdatingNameActive) {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    }
  }, [isUpdatingNameActive]);

  function handleUpdateName() {
    const trimmed = name.trim();

    if (trimmed.length > 50 || trimmed.length < 3) {
      return toast.error("Group name must be between 3 and 50 characters.");
    }

    setIsSavingName(true);

    socket.emit(
      "group_updated",
      {
        groupId: currentConversation._id,
        newName: trimmed,
      },
      (res) => {
        setIsSavingName(false);
        if (!res.success) return toast.error(res?.message);

        toast.success(res?.message);
        setIsUpdatingNameActive(false);
        nameInputRef.current.blur();
        setName(res?.name || "");
      },
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col relative items-center">
        <img
          src={profilePictureUrl}
          alt={currentConversation?.name}
          className={`rounded-full h-40 w-40 object-cover shadow-[0_5px_10px_var(--bg-secondary)] ${isUploading ? "opacity-30" : "opacity-100"}`}
        />

        {isAdminOrOwner && (
          <>
            <input
              type="file"
              accept="image/*"
              className="opacity-0 pointer-events-none -z-50 absolute"
              ref={pictureInputRef}
              onChange={(e) => updateProfilePicture(e)}
            />

            <button
              type="button"
              className="inline-flex gap-2 text-(--accent-color-primary) rounded-full py-2 px-4 no-hover text-md bg-(--bg-secondary) border border-(--foreground-primary)/20 relative bottom-6"
              onClick={() => {
                if (!pictureInputRef?.current) return;
                pictureInputRef.current.click();
              }}
            >
              <IconsWrapper icon={RiCamera4Line} size={20} /> Edit
            </button>
          </>
        )}
      </div>

      <div
        className={`${isAdminOrOwner ? "" : "pt-7"} max-w-full flex gap-2 items-center`}
      >
        {isUpdatingNameActive ? (
          <input
            maxLength={50}
            ref={nameInputRef}
            type="text"
            value={name}
            readOnly={!isUpdatingNameActive}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateName();
              if (e.key === "Escape") {
                setIsUpdatingNameActive(false);
                setName(currentConversation.name);
              }
            }}
            onChange={(e) => setName(e.currentTarget.value)}
            className={`transition duration-300 border-b truncate ${isAdminOrOwner && isUpdatingNameActive ? "pointer-events-auto" : "pointer-events-none"} ${isUpdatingNameActive ? "border-(--accent-color-primary) " : "border-transparent max-w-full field-sizing-content"}`}
            onBlur={(e) => {
              if (!nameInputRef.current) return;
              setIsUpdatingNameActive(false);
              setName(currentConversation?.name || "");
            }}
          />
        ) : (
          <span className="truncate text-center max-w-full border-b border-transparent">
            {name || "No Name"}
          </span>
        )}

        <span
          className={`rounded-full ${isSavingName ? "cursor-not-allowed opacity-40" : "cursor-pointer opacity-80"}`}
          onMouseDown={(e) => {
            e.preventDefault();
            if (isSavingName) return;
            if (!isUpdatingNameActive) {
              setIsUpdatingNameActive(true);
            } else {
              handleUpdateName();
              }
          }}
        >
          {isAdminOrOwner ? (
            <IconsWrapper
              icon={isUpdatingNameActive ? RiCheckLine : RiEdit2Line}
              size={18}
            />
          ) : null}
        </span>
      </div>

      {isDirect && (
        <div className="text-center  max-w-full">
          <p className={`pt-2 truncate opacity-50`}>
            {currentConversation?.bio}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
