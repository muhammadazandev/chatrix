import { lazy, Suspense, useEffect } from "react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import { slideInRight } from "../../../../motion/variants";
import Motion from "../../../../motion/Motion";
import UserListItems from "../../sidebar/userListItems/UserListItems";
import RenderActionButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import Loader from "../../../../components/Loader";

const FriendRequestsEmptyState = lazy(() =>
  import("../../sidebar/components/EmptyStates").then((module) => ({
    default: module.FriendRequestsEmptyState,
  })),
);

const FriendRequests = () => {
  const getFriendRequests = useFriendshipStore(
    (state) => state.getFriendRequests,
  );

  const pendingReceivedRequests = useFriendshipStore(
    (state) => state.pendingReceivedRequests,
  );

  const pendingSentRequests = useFriendshipStore(
    (state) => state.pendingSentRequests,
  );

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  function SentRenderActions(user, setMoreOpenIndex, requestId) {
    return (
      <RenderActionButtons
        user={user}
        status="outgoing"
        requestId={requestId}
        setMoreOpenIndex={setMoreOpenIndex}
      />
    );
  }

  function ReceivedRenderActions(user, setMoreOpenIndex, requestId) {
    return (
      <RenderActionButtons
        user={user}
        status="incoming"
        requestId={requestId}
        setMoreOpenIndex={setMoreOpenIndex}
      />
    );
  }

  const hasSent = pendingSentRequests?.length > 0;
  const hasReceived = pendingReceivedRequests?.length > 0;

  if (!hasSent && !hasReceived) {
    return (
      <Suspense fallback={<Loader />}>
        <FriendRequestsEmptyState />
      </Suspense>
    );
  }

  return (
    <Motion variants={slideInRight} className="mt-6 mb-4">
      <div className="flex flex-col gap-4 mt-5">
        <h3>Sent</h3>

        {hasSent ? (
          <UserListItems
            users={pendingSentRequests.map((req) => req.user1)}
            RenderActions={SentRenderActions}
            requestId={pendingSentRequests.map((req) => req._id)}
          />
        ) : (
          <div>You don’t have any sent requests.</div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-5">
        <h3>Received</h3>

        {hasReceived ? (
          <UserListItems
            users={pendingReceivedRequests.map((req) => req.user1)}
            RenderActions={ReceivedRenderActions}
            requestId={pendingReceivedRequests.map((req) => req._id)}
          />
        ) : (
          <div>You don’t have any received requests.</div>
        )}
      </div>
    </Motion>
  );
};

export default FriendRequests;
