import { useState } from "react";
import useAuthStore from "../../../../../../store/useAuthStore";
import Tooltip from "../../../../../../components/Tooltip";
import IconsWrapper from "../../../../../../utils/IconsWrapper";
import { RiCheckLine, RiPencilLine } from "@remixicon/react";
import toast from "react-hot-toast";
import { authApi } from "../../../../../../utils/api";

function ProfileField({
  field,
  activeField,
  setActiveField,
  inputsRef,
  user,
  value,
  setValue,
}) {
  const [loading, setLoading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);

  function validation() {
    let error = null;

    if (field === "username") {
      if (value.length > 25)
        return (error = "Username cannot exceed 25 characters");
      if (/[^a-zA-Z0-9_.]/.test(value))
        return (error =
          "Username only consist characters: a-z, A-Z, 0-9, _, and .");

      if (value === user.username)
        return (error = "Please enter a new username first");
    } else if (field === "bio") {
      if (value.length > 160) {
        return (error = "Bio cannot exceed 160 characters");
      }
      if (value === user.bio) return (error = "Please enter a new bio first");
    }

    return error;
  }

  function handleEditClick(field) {
    inputsRef?.current[field]?.focus();

    setActiveField(field);
  }

  async function handleAcceptClick(field) {
    if (loading) return;

    try {
      const url =
        field === "username" ? "/user/update-username" : "/user/update-bio";

      const bodyKey = field === "username" ? "newUsername" : "newBio";

      const error = validation();

      if (error) return toast.error(error);

      setLoading(true);

      const res = await authApi.patch(url, {
        [bodyKey]: value,
      });

      const updatedUser = res?.data?.user;
      updateUser(updatedUser);

      setValue(field === "username" ? updatedUser.username : updatedUser.bio);
      setActiveField(null);

      toast.success(res?.data?.message || `${field} updated successfully`);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 w-full pl-2">
      <h5 className="opacity-50 capitalize">{field}</h5>
      <div
        className="relative mt-4 flex w-full justify-between items-center border-b border-transparent transition-colors duration-300"
        style={{
          borderColor:
            activeField === field
              ? "var(--accent-color-primary)"
              : "transparent",
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          readOnly={activeField !== field}
          spellCheck={false}
          className="flex-1 bg-transparent text-lg w-[90%] truncate"
          ref={(el) => (inputsRef.current[field] = el)}
          onBlur={() => setActiveField(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (loading) return;
              handleAcceptClick(field);
            }
          }}
        />

        {activeField === field ? (
          <Tooltip content="Save Changes" delay={[1000, 0]}>
            <button
              className="rounded-full p-2.5 relative bottom-3"
              onMouseDown={(e) => {
                if (loading) return;
                e.preventDefault(); // prevents input blur
                handleAcceptClick(field);
              }}
              disabled={loading}
            >
              <IconsWrapper icon={RiCheckLine} />
            </button>
          </Tooltip>
        ) : (
          <Tooltip
            content={`Edit ${field === "username" ? "Username" : "Bio"}`}
            delay={[1000, 0]}
          >
            <button
              className="rounded-full p-2.5 relative bottom-3"
              onClick={() => handleEditClick(field)}
            >
              <IconsWrapper icon={RiPencilLine} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default ProfileField;
