import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import IconsWrapper from "../../utils/IconsWrapper";
import { useState } from "react";

const Form = ({ setUserData, userData, submitForm, isLoading }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-8 mt-8"
      method="post"
      onSubmit={(e) => submitForm(e)}
    >
      <input
        type="text"
        id="username"
        placeholder="Username"
        className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30"
        value={userData.username}
        onChange={(e) =>
          setUserData((prevInfo) => ({ ...prevInfo, username: e.target.value }))
        }
        required
      />
      <input
        type="email"
        id="email"
        placeholder="Email"
        className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30"
        value={userData.email}
        onChange={(e) =>
          setUserData((prevInfo) => ({ ...prevInfo, email: e.target.value }))
        }
        required
      />
      <div className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30 flex gap-3 justify-between group focus-within:border-(--accent-color-primary)">
        <input
          type={isShowPassword ? "text" : "password"}
          id="password"
          placeholder="Password"
          className="no-focus flex-1"
          value={userData.password}
          onChange={(e) =>
            setUserData((prevInfo) => ({
              ...prevInfo,
              password: e.target.value,
            }))
          }
          required
        />

        <button
          type="button"
          onClick={() => setIsShowPassword(!isShowPassword)}
          className="no-hover"
        >
          {isShowPassword ? (
            <IconsWrapper icon={RiEyeOffLine} size={22} />
          ) : (
            <IconsWrapper icon={RiEyeLine} size={22} />
          )}
        </button>
      </div>

      <button
        type="submit"
        className={`rounded-sm bg-(--accent-color-primary) text-white py-2 transition-all`}
        disabled={isLoading}
      >
        Sign up
      </button>
    </form>
  );
};

export default Form;
