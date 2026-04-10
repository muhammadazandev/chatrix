import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import IconsWrapper from "../../utils/IconsWrapper";
import { useState } from "react";
import { Link } from "react-router-dom";

const Form = ({
  isLoading,
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <form
      method="post"
      className="flex flex-col mt-8 gap-8"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(email, password);
      }}
    >
      <input
        type="email"
        placeholder="Email"
        className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="w-85 px-4 py-3 rounded-sm border border-(--foreground-primary)/30 flex gap-3 justify-between group focus-within:border-(--accent-color-primary)">
        <input
          type={isShowPassword ? "text" : "password"}
          placeholder="Password"
          className="no-focus flex-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <p className="opacity-50">
        Forgot password{" "}
        <Link
          to="/forgot-password"
          className="ml-2 text-blue-500 hover:underline"
        >
          Click here
        </Link>
      </p>

      <button
        type="submit"
        className={`rounded-sm bg-(--accent-color-primary) text-white py-2 transition-all`}
        disabled={isLoading}
      >
        Log in
      </button>
    </form>
  );
};

export default Form;
