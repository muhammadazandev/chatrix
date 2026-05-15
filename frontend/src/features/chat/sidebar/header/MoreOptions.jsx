import {
  RiUser3Fill,
  RiContrastFill,
  RiLogoutBoxFill,
  RiSettings4Fill,
} from "@remixicon/react";
import { motion } from "motion/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const MoreOptions = ({ setIsMoreOpen, isMoreOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [searchParams, setSearchParams] = useSearchParams();

  const options = useMemo(
    () => [
      {
        label: "Settings",
        id: "settings",
        variant: "primary",
        icon: RiSettings4Fill,
        onBtnClick: () => setSearchParams({ view: "settings" }),
      },
      {
        label: "Profile",
        id: "profile",
        variant: "primary",
        icon: RiUser3Fill,
        onBtnClick: () => setSearchParams({ view: "settings", tab: "profile" }),
      },
      {
        label: "Appearance",
        id: "appearance",
        variant: "primary",
        icon: RiContrastFill,
        onBtnClick: () =>
          setSearchParams({ view: "settings", tab: "appearance" }),
      },
      {
        label: "Log out",
        id: "logOut",
        variant: "danger",
        icon: RiLogoutBoxFill,
        onBtnClick: async () => {
          await logout();
          navigate("/login");
        },
      },
    ],
    [setSearchParams, navigate, logout],
  );

  return (
    <motion.div
      className="absolute -right-55 origin-top-left"
      initial={{ scale: 0.6, opacity: 0, position: "absolute" }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
    >
      <div className="flex flex-col gap-1 *:w-50 bg-(--bg-primary) border border-(--foreground-primary)/20 child rounded *:z-50">
        {options.map((opt) => {
          return (
            <button
              type="button"
              key={opt.id}
              className={`rounded p-2.5 inline-flex gap-4 items-center ${opt.variant === "danger" ? "bg-red-400/10 text-red-700" : ""}`}
              onClick={opt.onBtnClick}
            >
              <IconsWrapper icon={opt.icon} size={18} />
              {opt.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MoreOptions;
