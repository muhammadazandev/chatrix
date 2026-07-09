import { useEffect, useState } from "react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import RenderActionsButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import { AnimatePresence } from "motion/react";
import ConfirmBox from "../../../../components/ConfirmBox";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiUserForbidFill } from "@remixicon/react";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import toast from "react-hot-toast";
import useAuthStore from "../../../../store/useAuthStore";

function DirectActions({ friendId, close, updateParams }) {
  const getUserProfileInfo = useFriendshipStore(
    (state) => state.getUserProfileInfo,
  );
  const openedUserProfile = useFriendshipStore(
    (state) => state.openedUserProfile,
  );
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
    if (!friendId) return;
    getUserProfileInfo(friendId);
  }, [friendId, getUserProfileInfo]);

  useEffect(() => {
    if (isUnblockClicked)
      updateParams({ view: "conversation", conversationId: null });
  }, [isUnblockClicked, updateParams]);

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

function GroupActions({ currentConversation, close, updateParams }) {
  const [confirmAction, setConfirmAction] = useState(null);
  const user = useAuthStore((state) => state.user);
  const [isDeleting, setIsDeleting] = useState(false);

  function onConfirm() {
    if (!confirmAction) return;

    const eventName =
      confirmAction === "leave"
        ? SOCKET_EVENTS.LEAVE_GROUP
        : SOCKET_EVENTS.DELETE_GROUP;

    setIsDeleting(true);

    socket.emit(
      eventName,
      {
        groupId: currentConversation._id,
      },
      async (res) => {
        setIsDeleting(false);

        if (!res?.success) return toast.error(res?.message);

        toast.success(res?.message);
        setConfirmAction(false);
        await close();
        updateParams({ view: "conversation", conversationId: null });
      },
    );
  }

  function ActionButton({ action, label }) {
    return (
      <button
        className="danger-surface no-hover text-sm w-full flex items-center gap-3 px-4 py-2.5 no-hover text-(--foreground-primary) hover:bg-(--bg-secondary) opacity-85 hover:opacity-100 text-nowrap rounded-sm border border-(--foreground-secondary)/30"
        onClick={() => setConfirmAction(action)}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="pt-5">
      <div className="flex flex-col gap-2">
        <ActionButton action="leave" label="Leave Group" />

        {currentConversation.participantRoles[user._id] === "owner" && (
          <ActionButton action="delete" label="Delete Group" />
        )}
      </div>

      <AnimatePresence>
        {confirmAction && (
          <ConfirmBox
            confirmWhat={`${confirmAction === "leave" ? "leaveGroup" : "deleteGroup"}`}
            onConfirm={onConfirm}
            setIsConfirmOpen={setConfirmAction}
            isLoading={isDeleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const ActionButtons = ({ close, currentConversation }) => {
  const { updateParams } = useQueryParams();

  if (currentConversation.type === "direct") {
    return (
      <div>
        <h4 className="opacity-50">Actions</h4>
        <DirectActions
          updateParams={updateParams}
          friendId={currentConversation.friendId}
          close={close}
        />
      </div>
    );
  } else if (currentConversation.type === "group") {
    return (
      <div>
        <h4 className="opacity-50">Actions</h4>
        <GroupActions
          currentConversation={currentConversation}
          close={close}
          updateParams={updateParams}
        />
      </div>
    );
  }
};

export default ActionButtons;
