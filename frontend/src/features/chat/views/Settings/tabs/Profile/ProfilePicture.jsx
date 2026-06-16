import { RiCamera4Line } from "@remixicon/react";
import IconsWrapper from "../../../../../../utils/IconsWrapper";
import { useRef, useState } from "react";
import useAuthStore from "../../../../../../store/useAuthStore";
import { authApi } from "../../../../../../utils/api";
import toast from "react-hot-toast";

const ProfilePicture = ({ user }) => {
  const inputRef = useRef(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    user?.profilePicture || "",
  );
  const updateUser = useAuthStore((state) => state.updateUser);

  async function updateProfile(e) {
    if (!inputRef.current) return;
    const file = e.target.files[0];
    if (!file) return;

    // Instant preview
    setProfilePictureUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const res = await authApi.patch("/user/update-profile-picture", formData);

      updateUser(res.data.user);

      setProfilePictureUrl(res.data.user.profilePicture);

      toast.success(res.data.message || "Profile picture updated successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <img
          loading="lazy"
          src={profilePictureUrl}
          alt="Profile Picture"
          className="rounded-full h-40 w-40 object-cover shadow-[0_5px_10px_var(--bg-secondary)] cursor-pointer"
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
      </div>
    </div>
  );
};

export default ProfilePicture;
