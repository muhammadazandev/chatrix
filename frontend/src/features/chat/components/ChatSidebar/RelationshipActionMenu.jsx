import {
  RiUserAddFill,
  RiCloseLine,
  RiCheckLine,
  RiUserUnfollowFill,
} from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { friendshipStore } from "../../../../store/useFriendshipStore";
import ConfirmBox from "./ConfirmBox";

const {
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
  unblockUser,
} = friendshipStore.getState();

async function performAction(action, requestId, userId) {
  const actions = {
    accept: acceptFriendRequest,
    reject: rejectFriendRequest,
    cancel: cancelFriendRequest,
    send: sendFriendRequest,
    unblock: unblockUser,
  };

  const fn = actions[action];

  if (fn) {
    if (action === "accept" || action === "reject" || action === "cancel") {
      await fn(requestId);
    } else {
      await fn(userId);
    }
  }
}

// Buttons functions;

function SendRequest({ user, ...rest }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4 items-center"
      onClick={() => {
        performAction("send", undefined, user?._id);
      }}
    >
      <IconsWrapper icon={RiUserAddFill} size={18} />
      Send Request
    </button>
  );
}

function CancelRequest({ user, requestId, ...rest }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4 items-center"
      onClick={() => {
        performAction("cancel", requestId);
      }}
    >
      <IconsWrapper icon={RiCloseLine} size={20} />
      Cancel Request
    </button>
  );
}

function AcceptRequest({ user, requestId, ...rest }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4 items-center"
      onClick={() => {
        performAction("accept", requestId);
      }}
    >
      <IconsWrapper icon={RiCheckLine} size={20} />
      Accept Request
    </button>
  );
}

function RejectRequest({ user, requestId, ...rest }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4 items-center"
      onClick={() => {
        performAction("reject", requestId);
      }}
    >
      <IconsWrapper icon={RiCloseLine} size={20} />
      Reject Request
    </button>
  );
}

function UnfriendFriend({ user, setIsConfirmOpen, setConfirmBoxUserId }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4"
      onClick={() => {
        setIsConfirmOpen(true);
        setConfirmBoxUserId(user._id);
      }}
    >
      <IconsWrapper icon={RiUserUnfollowFill} size={18} />
      Unfriend
    </button>
  );
}

function Unblock({ user, ...rest }) {
  return (
    <button
      type="button"
      className="rounded p-2.5 inline-flex gap-4"
      onClick={() => {
        performAction("unblock", undefined, user._id);
      }}
    >
      <IconsWrapper icon={RiUserAddFill} size={18} />
      Unblock
    </button>
  );
}

const ACTIONS = {
  sendRequest: {
    label: "Add Friend",
    variant: "primary",
    Component: SendRequest,
  },
  acceptRequest: {
    label: "Accept",
    variant: "primary",
    Component: AcceptRequest,
  },
  rejectRequest: {
    label: "Reject",
    variant: "danger",
    Component: RejectRequest,
  },
  cancelRequest: {
    label: "Cancel Request",
    variant: "danger",
    Component: CancelRequest,
  },
  unfriend: {
    label: "Unfriend",
    variant: "danger",
    Component: UnfriendFriend,
  },
  unblock: { label: "Unblock", variant: "primary", Component: Unblock },
};

const RELATIONSHIP_ACTIONS = {
  none: ["sendRequest"],
  outgoing: ["cancelRequest"],
  incoming: ["acceptRequest", "rejectRequest"],
  friends: ["unfriend"],
  blocked: ["unblock"],
};

export default function RenderActionButtons({
  user,
  requestId,
  status,
  setIsConfirmOpen,
  setConfirmBoxUserId,
}) {
  const actionKeys = RELATIONSHIP_ACTIONS[status] || [];

  return (
    <>
      {actionKeys.map((key) => {
        const Action = ACTIONS[key]?.Component;

        if (!Action) return null;

        return (
          <Action
            key={key}
            user={user}
            requestId={requestId}
            // Pass the extra props, unused ones are safely ignored
            setIsConfirmOpen={setIsConfirmOpen}
            setConfirmBoxUserId={setConfirmBoxUserId}
          />
        );
      })}
    </>
  );
}
