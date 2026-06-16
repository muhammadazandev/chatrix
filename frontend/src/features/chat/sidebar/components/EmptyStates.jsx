import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import search_users from "../../../../assets/lotties/Search_Users.lottie";
import notificationBell from "../../../../assets/lotties/Notification_Bell.lottie";
import Shield from "../../../../assets/lotties/Shield.lottie";
import NotFound from "../../../../assets/lotties/Not_Found.lottie";
import NoConversation from "../../../../assets/lotties/No_conversation.lottie";
import { useFocusInput } from "../../../../Context/InputFocusContext";
import { useSearchParams } from "react-router-dom";

const BaseEmptyState = ({
  src,
  title,
  titleOffset = "bottom-10",
  children,
}) => {
  return (
    <div className="h-[55vh] w-full flex justify-center items-center flex-col">
      <DotLottieReact
        src={src}
        loop
        autoplay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <h3 className={`relative ${titleOffset} text-2xl`}>{title}</h3>

      {children && (
        <div className="flex gap-4 relative bottom-8">{children}</div>
      )}
    </div>
  );
};

const FriendListsEmptyState = () => {
  const inputRef = useFocusInput();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <BaseEmptyState
      src={search_users}
      title="No friends yet"
      titleOffset="bottom-15"
    >
      <button
        className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
        onClick={() => inputRef?.current?.focus()}
      >
        Find people
      </button>
      <button
        className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30"
        onClick={() => {
          const params = new URLSearchParams(searchParams);
          params.set("view", "requests");
          setSearchParams(params);
        }}
      >
        View Friend Requests
      </button>
    </BaseEmptyState>
  );
};

const FriendRequestsEmptyState = () => {
  const inputRef = useFocusInput();

  return (
    <BaseEmptyState
      src={notificationBell}
      title="No friend requests"
      titleOffset="bottom-15"
    >
      <button
        className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
        onClick={() => inputRef?.current?.focus()}
      >
        Find people
      </button>
    </BaseEmptyState>
  );
};

const BlockEmptyState = () => {
  return (
    <BaseEmptyState
      src={Shield}
      title="No block users"
      titleOffset="bottom-10"
    />
  );
};

const NoUserFound = () => {
  const inputRef = useFocusInput();

  return (
    <BaseEmptyState
      src={NotFound}
      title="No users found"
      titleOffset="bottom-10"
    >
      <button
        className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          inputRef.current?.focus();
        }}
      >
        Clear Search
      </button>
    </BaseEmptyState>
  );
};

const ConversationEmptyState = () => {
  return (
    <BaseEmptyState
      src={NoConversation}
      title="No Conversations"
      titleOffset="bottom-15"
    />
  );
};

export {
  FriendListsEmptyState,
  FriendRequestsEmptyState,
  BlockEmptyState,
  NoUserFound,
  ConversationEmptyState,
};
