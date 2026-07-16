import {
  RiUser3Fill,
  RiContrastFill,
  RiLogoutBoxFill,
  RiSettings4Fill,
  RiGroupFill,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import useAuthStore from "../../../../store/useAuthStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { popLift } from "../../../../motion/variants";
import Motion from "../../../../motion/Motion";
import { useQueryParams } from "../../../../hooks/useQueryParams";

const MoreOptions = ({ setIsMoreOpen, isMoreOpen }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { updateParams } = useQueryParams();

  const options = useMemo(
    () => [
      {
        label: "Settings",
        id: "settings",
        variant: "primary",
        icon: RiSettings4Fill,
        onBtnClick: () => updateParams({ view: "settings" }, true),
      },
      {
        label: "Create group",
        id: "createGroup",
        variant: "primary",
        icon: RiGroupFill,
        onBtnClick: () => updateParams({ view: "create-group" }, true),
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
    [updateParams, navigate, logout, setIsMoreOpen],
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
        className="fixed bottom-auto left-[calc(100%/3.7)] mt-2 w-42 z-55 rounded-xl border border-(--foreground-secondary)/30 bg-(--bg-primary) shadow-[0_0_15px_var(--foreground-primary)]/5 flex flex-col origin-top-left overflow-hidden p-1"
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
                className={`w-full px-3 py-2.5 my-0.5 inline-flex gap-3.5 items-center text-sm font-medium rounded-lg no-hover ${
                  isDanger
                    ? "no-hover danger-action"
                    : "text-(--foreground-primary) hover:bg-(--bg-secondary) opacity-85 hover:opacity-100"
                }`}
                onClick={async () => {
                  await setIsMoreOpen(false);
                  opt.onBtnClick();
                }}
              >
                <div
                  className={`flex items-center justify-center transition-transform duration-150 group-hover:scale-105 ${isDanger ? "danger-action" : "opacity-75"}`}
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
