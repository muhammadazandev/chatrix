import {
  RiUser3Fill,
  RiContrastFill,
  RiLogoutBoxFill,
  RiSettings4Fill,
} from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import Motion from "../../../../components/motion/Motion";
import { popLift } from "../../../../components/motion/variants";

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
          if (setIsMoreOpen) setIsMoreOpen(false);
        },
      },
    ],
    [setSearchParams, navigate, logout, setIsMoreOpen],
  );

  return (
    <>
      {isMoreOpen && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setIsMoreOpen(false)}
        />
      )}

      <Motion
        variants={popLift}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute -right-60  top-auto mt-2 w-56 z-50 rounded-lg border border-(--foreground-secondary) bg-(--bg-primary) p-1.5 flex flex-col origin-top-left"
      >
        {options.map((opt) => {
          const isDanger = opt.variant === "danger";

          return (
            <div key={opt.id} className="flex flex-col w-full">
              {isDanger && (
                <div className="h-px my-1.5 mx-2 bg-(--foreground-secondary)/30" />
              )}

              <button
                type="button"
                className={`w-full rounded-sm px-3 py-2.5 my-0.5 inline-flex gap-3.5 items-center text-sm font-medium cursor-pointer transition-all duration-150 active:scale-[0.98]
                  ${
                    isDanger
                      ? "text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/15"
                      : "text-(--foreground-primary) hover:bg-(--bg-secondary)/60 opacity-85 hover:opacity-100"
                  }`}
                onClick={() => {
                  opt.onBtnClick();
                  if (setIsMoreOpen) setIsMoreOpen(false);
                }}
              >
                <div
                  className={`flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${isDanger ? "text-red-500" : "opacity-75"}`}
                >
                  <IconsWrapper icon={opt.icon} size={18} />
                </div>
                <span>{opt.label}</span>
              </button>
            </div>
          );
        })}
      </Motion>
    </>
  );
};

export default MoreOptions;
