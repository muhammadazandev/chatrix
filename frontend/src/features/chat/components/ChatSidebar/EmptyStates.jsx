import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import search_users from "../../../../assets/lotties/Search_Users.lottie";
import notificationBell from "../../../../assets/lotties/Notification_Bell.lottie";
import Shield from "../../../../assets/lotties/Shield.lottie";
import NotFound from "../../../../assets/lotties/Not_Found.lottie";
import { useFocusInput } from "../../../../Context/InputFocusContext";

const FriendListsEmptyState = ({ setCurrentView }) => {
  const inputRef = useFocusInput();

  return (
    <div className="h-[55vh] w-full flex justify-center items-center flex-col">
      <DotLottieReact
        src={search_users}
        loop
        autoplay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <h3 className="relative bottom-15 text-2xl">No friends yet</h3>
      <div className="flex gap-4 relative bottom-8">
        <button
          className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
          onClick={() => inputRef?.current?.focus()}
        >
          Find people
        </button>
        <button
          className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30"
          onClick={() => {
            setCurrentView("requests");
          }}
        >
          View Friend Requests
        </button>
      </div>
    </div>
  );
};

const FriendRequestsEmptyState = () => {
  const inputRef = useFocusInput();

  return (
    <div className="h-[55vh] w-full flex justify-center items-center flex-col">
      <DotLottieReact
        src={notificationBell}
        loop
        autoplay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <h3 className="relative bottom-15 text-2xl">No friend requests</h3>
      <div className="flex gap-4 relative bottom-8">
        <button
          className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
          onClick={() => inputRef?.current?.focus()}
        >
          Find people
        </button>
      </div>
    </div>
  );
};

const BlockEmptyState = () => {
  return (
    <div className="h-[55vh] w-full flex justify-center items-center flex-col">
      <DotLottieReact
        src={Shield}
        loop
        autoplay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <h3 className="relative bottom-10 text-2xl">No block users</h3>
    </div>
  );
};

const NoUserFound = () => {
  const inputRef = useFocusInput();

  return (
    <div className="h-[55vh] w-full flex justify-center items-center flex-col">
      <DotLottieReact
        src={NotFound}
        loop
        autoplay
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <h3 className="relative bottom-10 text-2xl">No users found</h3>

      <div className="flex gap-4 relative bottom-8">
        <button
          className="rounded-sm px-4 py-2 text-sm border border-(--foreground-primary)/30 bg-(--accent-color-primary) text-white"
          onClick={() => {
            inputRef.current && (inputRef.current.value = "");
            inputRef.current?.focus();
          }}
        >
          Clear Search
        </button>
      </div>
    </div>
  );
};

export {
  FriendListsEmptyState,
  FriendRequestsEmptyState,
  BlockEmptyState,
  NoUserFound,
};
