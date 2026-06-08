import { RiArrowLeftLine, RiUserForbidFill } from "@remixicon/react";
import Motion from "../../../../motion/Motion";
import { slideInRight } from "../../../../motion/variants";
import Tooltip from "../../../../components/Tooltip";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useEffect, useState } from "react";
import RenderActionButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import { AnimatePresence } from "motion/react";
import ConfirmBox from "../../../../components/ConfirmBox";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useSlidePanelClose from "../../../../hooks/useSlidePanelClose";

const Profile = () => {
  const { searchParams, updateParams } = useQueryParams();
  const userId = searchParams.get("userId");
  const openedUserProfile = useFriendshipStore(
    (state) => state.openedUserProfile,
  );
  const getUserProfileInfo = useFriendshipStore(
    (state) => state.getUserProfileInfo,
  );
  const blockUser = useFriendshipStore((state) => state.blockUser);
  const unfriend = useFriendshipStore((state) => state.unfriend);
  const isLoading = useFriendshipStore((state) => state.isLoading);
  const updateOpenedUserRelationship = useFriendshipStore(
    (state) => state.updateOpenedUserRelationship,
  );
  const [isTruncateBio, setIsTruncateBio] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const { scope, close } = useSlidePanelClose();

  useEffect(() => {
    if (!userId) return;
    getUserProfileInfo(userId);
  }, [userId]);

  async function onConfirmClick() {
    if (!userId || !openedUserProfile) return;

    if (confirmAction === "block") {
      await blockUser(userId);
      updateOpenedUserRelationship("blocked");
    } else {
      await unfriend(userId);
      updateOpenedUserRelationship("none");
    }

    setIsConfirmOpen(false);
  }

  const STATUS_LABELS = {
    none: "No Relationship",
    outgoing: "Request Sent",
    incoming: "Incoming Request",
    friends: "Friends",
    blocked: "Blocked",
  };

  return (
    <Motion variants={slideInRight} ref={scope}>
      <div>
        {openedUserProfile ? (
          <div className="bg-(--bg-primary) w-full">
            <div className="flex justify-between">
              <Tooltip content="Back" delay={[1000, 0]}>
                <button
                  className="p-2.5 rounded-full"
                  onClick={async () => {
                    await close();
                    updateParams({ view: null, userId: null });
                  }}
                >
                  <IconsWrapper icon={RiArrowLeftLine} />
                </button>
              </Tooltip>

              <span className="rounded-full px-4 py-2.5 bg-(--accent-color-primary)/20 border border-(--foreground-secondary)/30 text-sm text-center">
                {STATUS_LABELS[openedUserProfile.relationshipStatus]}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex justify-center">
                <img
                  className="rounded-full h-40 w-40 object-cover shadow-[0_5px_10px_var(--bg-secondary)]"
                  src={openedUserProfile?.profilePicture}
                  alt="Profile Picture"
                />
              </div>

              <div className="mt-15 flex flex-col gap-10 px-3">
                <div className="flex justify-between">
                  <div>
                    <h4 className="opacity-50">Username</h4>
                    <p className="pt-4">{openedUserProfile.username}</p>
                  </div>
                  <p className="pt-4 opacity-75">
                    [{openedUserProfile.friendsCount} Friends]
                  </p>
                </div>

                <div>
                  <h4 className="opacity-50">Bio</h4>
                  <p
                    className={`pt-4 ${isTruncateBio ? "truncate max-w-full" : ""} cursor-pointer`}
                    onClick={() => setIsTruncateBio(!isTruncateBio)}
                  >
                    {openedUserProfile.bio}
                  </p>
                </div>
                <div>
                  <h4 className="opacity-50">Action</h4>

                  <div
                    className={`pt-4 [&_button]:rounded-sm [&_button]:border [&_button]:border-(--foreground-primary)/20 gap-3 flex flex-col ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <RenderActionButtons
                      status={openedUserProfile.relationshipStatus}
                      user={openedUserProfile}
                      requestId={openedUserProfile?.requestId}
                      setIsConfirmOpen={setIsConfirmOpen}
                      setConfirmAction={setConfirmAction}
                      onStartChat={async () => {
                        await close();
                        updateParams({ view: null, userId: null });
                      }}
                    />

                    {openedUserProfile.relationshipStatus !== "blocked" ? (
                      <button
                        type="button"
                        className="text-sm text-(--foreground-primary) w-full flex items-center gap-3 px-4 py-2.5 bg-red-500/10"
                        onClick={() => {
                          setIsConfirmOpen(true);
                          setConfirmAction("block");
                        }}
                      >
                        <IconsWrapper
                          icon={RiUserForbidFill}
                          size={18}
                          className="shrink-0 opacity-70"
                        />
                        <span>Block</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            No user selected
          </div>
        )}

        <AnimatePresence>
          {isConfirmOpen && (
            <ConfirmBox
              confirmWhat={`${confirmAction === "block" ? "block" : ""}`}
              setIsConfirmOpen={setIsConfirmOpen}
              onConfirm={onConfirmClick}
            />
          )}
        </AnimatePresence>
      </div>
    </Motion>
  );
};

export default Profile;
