import { useState } from "react";
import useAuthStore from "../../../../../../store/useAuthStore";
import Tooltip from "../../../../../../components/Tooltip";
import IconsWrapper from "../../../../../../utils/IconsWrapper";
import { RiCheckLine, RiEmotionHappyLine, RiPencilLine } from "@remixicon/react";
import toast from "react-hot-toast";
import { authApi } from "../../../../../../utils/api";
import useEmojiPicker from "../../../../../../hooks/useEmojiPicker";
import SharedEmojiPicker from "../../../../../../components/SharedEmojiPicker";

function ProfileField({
  field,
  activeField,
  setActiveField,
  inputsRef,
  user,
  value: initialValue,
  setValue: setInitialValue,
  formData,
}) {
  const [loading, setLoading] = useState(false);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { value, setValue, isOpen, handleEmojiSelect, closePicker, togglePicker } =
    useEmojiPicker(initialValue);

  function validation() {
    let error = null;

    // Matches any character that is NOT a-z, A-Z, 0-9, _, ., or a native Emoji
    const invalidCharacterRegex = /[^\w.\p{Extended_Pictographic}]/u;

    if (field === "username") {
      if ([...value].length > 25)
        return (error = "Username cannot exceed 25 characters");
      if (invalidCharacterRegex.test(value))
        return (error =
          "Username can only consist of characters: a-z, A-Z, 0-9, _, ., and emojis");

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
          onChange={(e) => {
            const newValue = e.currentTarget.value;

            if (field === "username") {
              const allowedRegex = /[a-zA-Z0-9_.]|\p{Extended_Pictographic}/gu;
              const matches = newValue.match(allowedRegex);
              const filteredValue = matches ? matches.join("") : "";
              setValue(filteredValue);
            } else {
              setValue(newValue);
            }
          }}
          readOnly={activeField !== field}
          spellCheck={false}
          className="flex-1 bg-transparent text-lg w-[90%] truncate z-30"
          ref={(el) => (inputsRef.current[field] = el)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (loading) return;
              handleAcceptClick(field);
            }
          }}
        />

        <SharedEmojiPicker
          classes="absolute left-[105%] -translate-y-1/3 ml-4 origin-bottom-left"
          isOpen={isOpen}
          handleEmojiSelect={handleEmojiSelect}
          closePicker={closePicker}
        />

        {activeField === field ? (
          <div className="flex gap-2">
            <div
              className="fixed top-0 left-0 z-20 h-screen w-screen"
              onClick={() => {
                setActiveField(null);
                setValue(
                  field === "username" ? formData.username : formData.bio,
                );
              }}
            />
            <Tooltip content="Open Emoji Picker" delay={[1000, 0]}>
              <button
                className="rounded-full p-2 relative bottom-3 z-30"
                onClick={togglePicker}
              >
                <IconsWrapper icon={RiEmotionHappyLine} size={20} />
              </button>
            </Tooltip>

            <Tooltip content="Save Changes" delay={[1000, 0]}>
              <button
                className="rounded-full p-2 relative bottom-3 z-30"
                onMouseDown={(e) => {
                  if (loading) return;
                  e.preventDefault(); // prevents input blur
                  handleAcceptClick(field);
                }}
                disabled={loading}
              >
                <IconsWrapper icon={RiCheckLine} size={20} />
              </button>
            </Tooltip>
          </div>
        ) : (
          <Tooltip
            content={`Edit ${field === "username" ? "Username" : "Bio"}`}
            delay={[1000, 0]}
          >
            <button
              className="rounded-full p-2 relative bottom-3 z-30"
              onClick={() => handleEditClick(field)}
              type="button"
            >
              <IconsWrapper icon={RiPencilLine} size={20} />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default ProfileField;
