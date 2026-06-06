import {
  RiUserAddFill,
  RiCloseLine,
  RiCheckLine,
  RiUserUnfollowFill,
  RiChat3Fill,
} from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { friendshipStore } from "../../../../store/useFriendshipStore";
import { getChatState } from "../../../../store/useChatStore";
import { useSearchParams } from "react-router-dom";

const ACTIONS = {
  sendRequest: {
    label: "Add Friend",
    icon: RiUserAddFill,
  },
  acceptRequest: {
    label: "Accept",
    icon: RiCheckLine,
  },
  rejectRequest: {
    label: "Reject",
    icon: RiCloseLine,
  },
  cancelRequest: {
    label: "Cancel Request",
    icon: RiCloseLine,
  },
  unfriend: {
    label: "Unfriend",
    icon: RiUserUnfollowFill,
  },
  startChat: {
    label: "Start Chat",
    icon: RiChat3Fill,
  },
  unblock: {
    label: "Unblock",
    icon: RiUserAddFill,
  },
};

async function performAction({
  actionKey,
  requestId,
  userId,
  targetUserId,
  setSearchParams,
  searchParams,
}) {
  const {
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    sendFriendRequest,
    unblockUser,
    unfriend,
  } = friendshipStore.getState();
  const { accessConversation } = getChatState();

  switch (actionKey) {
    case "acceptRequest":
      await acceptFriendRequest(requestId);
      break;

    case "rejectRequest":
      await rejectFriendRequest(requestId);
      break;

    case "cancelRequest":
      await cancelFriendRequest(requestId);
      break;

    case "sendRequest":
      await sendFriendRequest(userId);
      break;

    case "unblock":
      await unblockUser(userId);
      break;

    case "unfriend":
      await unfriend(userId);
      break;

    case "startChat":
      await accessConversation(targetUserId, (conversationId) => {
        const params = new URLSearchParams(searchParams);
        params.set("conversationId", conversationId);
        setSearchParams(params);
      });
      break;

    default:
      break;
  }
}

function ActionButton({
  user,
  setMoreOpenIndex,
  actionKey,
  requestId,
  setIsConfirmOpen,
  setConfirmBoxUserId,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = async () => {
    if (actionKey === "unfriend") {
      setIsConfirmOpen(true);
      setConfirmBoxUserId(user._id);
      setMoreOpenIndex?.(null);
      return;
    }

    await performAction({
      actionKey,
      requestId,
      userId: user._id,
      targetUserId: user._id,
      setSearchParams,
      searchParams,
    });

    setMoreOpenIndex?.(null);
  };

  return (
    <button
      type="button"
      className="text-sm text-(--foreground-primary) w-full flex items-center gap-3 px-4 py-2.5"
      onClick={handleClick}
    >
      <IconsWrapper
        icon={ACTIONS[actionKey].icon}
        size={18}
        className="shrink-0 opacity-70"
      />
      <span>{ACTIONS[actionKey].label}</span>
    </button>
  );
}

const RELATIONSHIP_ACTIONS = {
  none: ["sendRequest"],
  outgoing: ["cancelRequest"],
  incoming: ["acceptRequest", "rejectRequest"],
  friends: ["startChat", "unfriend"],
  blocked: ["unblock"],
};

export default function RenderActionButtons({
  user,
  setMoreOpenIndex,
  requestId,
  status,
  setIsConfirmOpen,
  setConfirmBoxUserId,
}) {
  const actionKeys = RELATIONSHIP_ACTIONS[status] || [];

  return (
    <>
      {actionKeys.map((key) => (
        <ActionButton
          key={key}
          user={user}
          actionKey={key}
          requestId={requestId}
          setMoreOpenIndex={setMoreOpenIndex}
          setIsConfirmOpen={setIsConfirmOpen}
          setConfirmBoxUserId={setConfirmBoxUserId}
        />
      ))}
    </>
  );
}
