import useAuthStore from "../../../../store/useAuthStore";
import {
  RiArrowLeftLine,
  RiUser3Line,
  RiContrastLine,
  RiLogoutBoxLine,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Profile from "./tabs/Profile/Profile";
import Appearance from "./tabs/Appearance/Appearance";
import Tooltip from "../../../../components/Tooltip";
import Motion from "../../../../motion/Motion";
import { slideInFromLeft } from "../../../../motion/variants";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useSlidePanelClose from "../../../../hooks/useSlidePanelClose";

const tabs = [
  {
    label: "Profile",
    id: "profile",
    variant: "primary",
    description: "Name, profile photo, bio",
    icon: RiUser3Line,
  },
  {
    label: "Appearance",
    id: "appearance",
    variant: "primary",
    description: "Theme, Wallpaper, Chat Settings",
    icon: RiContrastLine,
  },
  {
    label: "Log out",
    id: "logOut",
    variant: "danger",
    icon: RiLogoutBoxLine,
  },
];

const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { searchParams, updateParams } = useQueryParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get("tab");
  const { scope, close } = useSlidePanelClose();

  async function handleBack() {
    await close();
    updateParams({ view: null });
  }

  function renderTab() {
    switch (currentTab) {
      case "profile":
        return <Profile key="profile" />;

      case "appearance":
        return <Appearance key="appearance" />;

      default:
        return <div />;
    }
  }

  return (
    <div className="relative" ref={scope}>
      {user && (
        <div className="relative">
          <header className="flex gap-3 items-center mb-4 relative z-10">
            <Tooltip content="Back" delay={[1000, 0]}>
              <button
                className="p-2.5 rounded-full"
                onClick={() => {
                  handleBack();
                }}
              >
                <IconsWrapper icon={RiArrowLeftLine} />
              </button>
            </Tooltip>
          </header>

          <div className="flex flex-col items-center mt-5">
            <img
              loading="lazy"
              src={user?.profilePicture}
              alt="Profile Picture"
              className="rounded-full h-40 w-40 object-cover shadow-[0_5px_10px_var(--bg-secondary)]"
            />
            <div className="flex gap-4 mt-10 flex-col w-full">
              {tabs.map((tab) => {
                return (
                  <button
                    className={`rounded-md py-3 px-4 inline-flex items-center gap-6 ${tab.variant === "danger" ? "bg-red-400/10 text-red-700" : ""}`}
                    key={tab?.id}
                    onClick={async () => {
                      if (tab.id === "logOut") {
                        await logout();
                        navigate("/login");
                      } else {
                        updateParams({ tab: tab.id });
                      }
                    }}
                  >
                    <IconsWrapper icon={tab?.icon} />

                    <div className="*:text-start">
                      <p>{tab?.label}</p>
                      <span className="opacity-50 text-sm truncate max-w-95%">
                        {tab?.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="w-full mt-20 overflow-hidden">
        <AnimatePresence mode="wait">
          <Motion
            variants={slideInFromLeft}
            key={currentTab || "empty"}
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
          >
            <div className="pointer-events-auto p-6">{renderTab()}</div>
          </Motion>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
