import { RiMore2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { RiUserForbidFill } from "@remixicon/react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import Motion from "../../../../motion/Motion";
import { popLift } from "../../../../motion/variants";
import ProfilePicture from "./ProfilePicture";
import ConfirmBox from "../../../../components/ConfirmBox";

const UserListItems = ({
  users = [],
  requestId = [],
  RenderActions,
  isShowBlockButton = true,
}) => {
  const [moreOpenIndex, setMoreOpenIndex] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmBoxUserId, setConfirmBoxUserId] = useState(null);
  const blockUser = useFriendshipStore((state) => state.blockUser);

  async function runBlockUser(userId) {
    await blockUser(userId);
    setIsConfirmOpen(false);
    setConfirmBoxUserId(null);
    setMoreOpenIndex(null); // Close menu on block success
  }

  return (
    <div className="flex flex-col gap-1">
      {users?.map((user, index) => {
        const isMenuOpen = moreOpenIndex === index;

        return (
          <div
            key={user._id}
            className="group p-3.5 flex items-center justify-between gap-4 transition-all duration-200 rounded-lg relative border-b border-(--foreground-secondary)/30 hover:bg-(--bg-secondary)/50"
          >
            {/* User Profile Card Section */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                {user && <ProfilePicture user={user} />}
              </div>

              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-(--foreground-primary) tracking-wide">
                  {user.username}
                </h3>
                <p className="text-xs font-medium opacity-50 truncate max-w-60 mt-0.5">
                  {user.bio || "No bio available"}
                </p>

                {user.isOnline === null ||
                user.isOnline === undefined ? null : (
                  <div
                    className={`absolute p-1.5 bottom-1 left-1 border border-(--foreground-primary)/50 rounded-full ${user.isOnline ? "bg-green-600" : "bg-transparent"}`}
                  />
                )}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex items-center gap-1.5 relative">
              <button
                type="button"
                className={`p-2 rounded-full cursor-pointer transition-all duration-200 hover:bg-(--bg-secondary) text-(--foreground-primary)
                  ${isMenuOpen ? "bg-(--bg-secondary) scale-95 opacity-100" : "opacity-60 hover:opacity-100"}`}
                onClick={() => setMoreOpenIndex(isMenuOpen ? null : index)}
              >
                <IconsWrapper icon={RiMore2Fill} size={18} />
              </button>

              {/* Outside Click Backdrop Catcher per Active Dropdown */}
              {isMenuOpen && (
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMoreOpenIndex(null)}
                />
              )}

              <AnimatePresence>
                {isMenuOpen && (
                  <Motion
                    variants={popLift}
                    className="absolute right-0 top-full mt-2 z-50 flex flex-col origin-top-right overflow-hidden w-42 rounded-xl border border-(--foreground-secondary)/30 bg-(--bg-primary) shadow-[0_0_15px_var(--foreground-primary)]/5 p-1 [&_button]:rounded-lg no-hover"
                  >
                    {RenderActions?.(
                      user,
                      setMoreOpenIndex,
                      requestId[index],
                      setIsConfirmOpen,
                      setConfirmBoxUserId,
                    )}

                    {isShowBlockButton && (
                      <>
                        <div className="h-px bg-(--foreground-secondary)/20 mx-2 my-1" />
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 mt-2 !hover:bg-red-500/10 dark:hover:bg-red-500/15 no-hover"
                          onClick={() => {
                            setConfirmBoxUserId(user._id);
                            setIsConfirmOpen(true);
                          }}
                        >
                          <IconsWrapper icon={RiUserForbidFill} size={18} />
                          <span>Block user</span>
                        </button>
                      </>
                    )}
                  </Motion>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Global Confirm Modal Portal Placement */}
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmBox
            confirmWhat="block"
            setIsConfirmOpen={setIsConfirmOpen}
            onConfirm={() => runBlockUser(confirmBoxUserId)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserListItems;
