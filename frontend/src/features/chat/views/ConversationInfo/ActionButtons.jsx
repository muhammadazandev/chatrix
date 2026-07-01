import { useEffect, useState } from "react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import RenderActionsButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import { AnimatePresence } from "motion/react";
import ConfirmBox from "../../../../components/ConfirmBox";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiUserForbidFill } from "@remixicon/react";
import { useQueryParams } from "../../../../hooks/useQueryParams";

function DirectActions({ currentConversation, close }) {
  const getUserProfileInfo = useFriendshipStore(
    (state) => state.getUserProfileInfo,
  );
  const openedUserProfile = useFriendshipStore(
    (state) => state.openedUserProfile,
  );
  const { updateParams } = useQueryParams();
  const blockUser = useFriendshipStore((state) => state.blockUser);
  const unfriend = useFriendshipStore((state) => state.unfriend);
  const isLoading = useFriendshipStore((state) => state.isLoading);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const updateOpenedUserRelationship = useFriendshipStore(
    (state) => state.updateOpenedUserRelationship,
  );
  const [isUnblockClicked, setIsUnblockClicked] = useState(false);

  async function onConfirmClick() {
    if (!openedUserProfile) return;

    if (confirmAction === "block") {
      await blockUser(openedUserProfile._id);
      updateOpenedUserRelationship("blocked");
    } else {
      await unfriend(openedUserProfile._id);
      updateOpenedUserRelationship("none");
    }

    setIsConfirmOpen(false);
    await close();
    updateParams({ view: "conversation", conversationId: null });
  }

  useEffect(() => {
    if (!currentConversation.friendId) return;
    getUserProfileInfo(currentConversation.friendId);
  }, [currentConversation.friendId, getUserProfileInfo]);

  useEffect(() => {
    if (isUnblockClicked)
      updateParams({ view: "conversation", conversationId: null });
  }, [isUnblockClicked]);

  return (
    <div
      className={`pt-4 [&_button]:rounded-sm [&_button]:border [&_button]:border-(--foreground-primary)/20 gap-3 flex flex-col ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <RenderActionsButtons
        status={openedUserProfile?.relationshipStatus}
        user={openedUserProfile}
        requestId={openedUserProfile?.requestId}
        setIsConfirmOpen={setIsConfirmOpen}
        setConfirmAction={setConfirmAction}
        setIsUnblockClicked={setIsUnblockClicked}
        isBlockedByMe={openedUserProfile?.isBlockedByMe}
      />

      <div>
        {openedUserProfile?.relationshipStatus !== "blocked" ? (
          <button
            type="button"
            className="text-sm text-(--foreground-primary) w-full flex items-center gap-3 px-4 py-2.5 danger-surface no-hover"
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
  );
}

const ActionButtons = ({ close, currentConversation }) => {
  if (currentConversation.type === "direct") {
    return (
      <div>
        <h4 className="opacity-50">Actions</h4>
        <DirectActions
          currentConversation={currentConversation}
          close={close}
        />
      </div>
    );
  }
};

export default ActionButtons;
