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
const {
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
  unblockUser,
} = friendshipStore.getState();
const { accessConversation } = getChatState();
async function performAction(
  action,
  requestId,
  userId,
  targetUserId,
  setSearchParams,
  searchParams,
) {
  const actions = {
    accept: acceptFriendRequest,
    reject: rejectFriendRequest,
    cancel: cancelFriendRequest,
    send: sendFriendRequest,
    unblock: unblockUser,
    accessConversation: accessConversation,
  };
  const fn = actions[action];
  if (fn) {
    if (action === "accept" || action === "reject" || action === "cancel") {
      await fn(requestId);
    } else if (action === "accessConversation") {
      await fn(targetUserId, (conversationId) => {
        const params = new URLSearchParams(searchParams);
        params.set("conversationId", conversationId);
        setSearchParams(params);
      });
    } else {
      await fn(userId);
    }
  }
} // Buttons functions;
const buttonsClasses = {
  base: "w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200",
  hover:
    "hover:bg-(--foreground-secondary)/10 active:bg-(--foreground-secondary)/15 active:scale-[0.98]",
  noHover: "",
  text: "text-sm text-(--foreground-primary)",
  icon: "flex-shrink-0 opacity-70",
};
function SendRequest({ user, noHover = false, setMoreOpenIndex, ...rest }) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction("send", undefined, user?._id);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiUserAddFill}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Add Friend</span>
    </button>
  );
}

function CancelRequest({
  user,
  requestId,
  noHover = false,
  setMoreOpenIndex,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction("cancel", requestId);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiCloseLine}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Cancel Request</span>
    </button>
  );
}

function AcceptRequest({
  user,
  requestId,
  setMoreOpenIndex,
  noHover = false,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction("accept", requestId);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiCheckLine}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Accept</span>
    </button>
  );
}

function RejectRequest({
  user,
  requestId,
  setMoreOpenIndex,
  noHover = false,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction("reject", requestId);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiCloseLine}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Reject</span>
    </button>
  );
}

function UnfriendFriend({
  user,
  setIsConfirmOpen,
  setConfirmBoxUserId,
  noHover = false,
  setMoreOpenIndex,
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        setIsConfirmOpen(true);
        setConfirmBoxUserId(user._id);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiUserUnfollowFill}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Unfriend</span>
    </button>
  );
}

function Unblock({ user, noHover = false, setMoreOpenIndex, ...rest }) {
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction("unblock", undefined, user._id);
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiUserAddFill}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Unblock</span>
    </button>
  );
}

function AccessConversation({
  user,
  targetUserId,
  noHover = false,
  setMoreOpenIndex,
  ...rest
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <button
      type="button"
      className={`${buttonsClasses.base} ${buttonsClasses.text} ${noHover ? "" : buttonsClasses.hover}`}
      onClick={() => {
        performAction(
          "accessConversation",
          undefined,
          undefined,
          targetUserId,
          setSearchParams,
          searchParams,
        );
        setMoreOpenIndex?.(null);
      }}
    >
      <IconsWrapper
        icon={RiChat3Fill}
        size={18}
        className={buttonsClasses.icon}
      />
      <span>Start Conversation</span>
    </button>
  );
}

const ACTIONS = {
  sendRequest: {
    label: "Add Friend",
    Component: SendRequest,
  },
  acceptRequest: {
    label: "Accept",
    Component: AcceptRequest,
  },
  rejectRequest: {
    label: "Reject",
    Component: RejectRequest,
  },
  cancelRequest: {
    label: "Cancel Request",
    Component: CancelRequest,
  },
  unfriend: {
    label: "Unfriend",
    Component: UnfriendFriend,
  },
  startChat: {
    label: "Start Chat",
    Component: AccessConversation,
  },
  unblock: {
    label: "Unblock",
    Component: Unblock,
  },
};

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
      {actionKeys.map((key) => {
        const Action = ACTIONS[key]?.Component;
        if (!Action) return null;
        return (
          <Action
            key={key}
            user={user}
            setMoreOpenIndex={setMoreOpenIndex}
            // Pass the extra props, unused ones are safely ignored
            setIsConfirmOpen={setIsConfirmOpen}
            setConfirmBoxUserId={setConfirmBoxUserId}
            targetUserId={user._id}
            requestId={requestId}
          />
        );
      })}
    </>
  );
}
