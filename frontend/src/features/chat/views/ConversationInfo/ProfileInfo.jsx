import { RiCamera4Line } from "@remixicon/react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import IconsWrapper from "../../../../components/IconsWrapper";
import { authApi } from "../../../../utils/api";
import useAuthStore from "../../../../store/useAuthStore";

const ProfileInfo = ({ currentConversation }) => {
  const isDirect = currentConversation?.type === "direct";
  const inputRef = useRef(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    currentConversation?.avatar || null,
  );
  const user = useAuthStore((state) => state.user);
  const userId = user._id;
  const [isUploading, setIsUploading] = useState(false);

  const isAdminOrOwner = currentConversation?.roles[userId] !== "member";

  useEffect(() => {
    if (!currentConversation) return;
    setProfilePictureUrl(currentConversation.avatar);
  }, [currentConversation]);

  async function updateProfile(e) {
    if (!inputRef.current) return;
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
              ref={inputRef}
              onChange={(e) => updateProfile(e)}
            />

            <button
              type="button"
              className="inline-flex gap-2 text-(--accent-color-primary) rounded-full py-2 px-4 no-hover text-md bg-(--bg-secondary) border border-(--foreground-primary)/20 relative bottom-6"
              onClick={() => {
                if (!inputRef?.current) return;
                inputRef.current.click();
              }}
            >
              <IconsWrapper icon={RiCamera4Line} size={20} /> Edit
            </button>
          </>
        )}
      </div>

      <div className={`${isAdminOrOwner ? "" : "pt-7"}`}>
        <p>{currentConversation?.name}</p>
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
