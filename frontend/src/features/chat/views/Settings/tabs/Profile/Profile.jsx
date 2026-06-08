import { RiArrowLeftLine, RiFileCopyLine } from "@remixicon/react";
import { useNavigate } from "react-router-dom";
import IconsWrapper from "../../../../../../utils/IconsWrapper";
import useAuthStore from "../../../../../../store/useAuthStore";
import Tooltip from "../../../../../../components/Tooltip";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import ProfileField from "./ProfileField";
import ProfilePicture from "./ProfilePicture";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [activeField, setActiveField] = useState(null);
  const inputsRef = useRef({});
  const [formData, setFormData] = useState({
    username: user.username || "",
    bio: user.bio || "",
  });

  return (
    <div className="pointer-events-auto bg-(--bg-primary) h-[95vh] w-full absolute top-0 left-0 z-40">
      <Tooltip content="Back" delay={[1000, 0]}>
        <button className="p-2.5 rounded-full" onClick={() => navigate(-1)}>
          <IconsWrapper icon={RiArrowLeftLine} />
        </button>
      </Tooltip>

      {user && (
        <div className="mt-5">
          <ProfilePicture user={user} />

          <ProfileField
            field="username"
            activeField={activeField}
            setActiveField={setActiveField}
            inputsRef={inputsRef}
            user={user}
            value={formData.username}
            setValue={(value) =>
              setFormData((prev) => ({
                ...prev,
                username: value,
              }))
            }
          />

          <ProfileField
            field="bio"
            activeField={activeField}
            setActiveField={setActiveField}
            inputsRef={inputsRef}
            user={user}
            value={formData.bio}
            setValue={(value) =>
              setFormData((prev) => ({
                ...prev,
                bio: value,
              }))
            }
          />

          <div className="bg-(--accent-color-primary) py-[0.1px] w-full opacity-20 mt-10" />

          <div className="mt-10 w-full pl-2">
            <h5 className="opacity-50">Email</h5>
            <div className="mt-4 flex w-full justify-between pr-4 items-start">
              <p className="truncate max-w-[90%]">{user?.email}</p>

              <Tooltip content="Copy Email" delay={[1000, 0]}>
                <button
                  className="rounded-full p-2.5 relative bottom-3"
                  onClick={async () => {
                    await navigator.clipboard.writeText(user?.email || "");
                    toast.success("Email copied to clipboard!");
                  }}
                >
                  <IconsWrapper icon={RiFileCopyLine} size={20} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
