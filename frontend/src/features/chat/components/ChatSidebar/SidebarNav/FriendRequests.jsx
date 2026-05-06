import { useEffect } from "react";
import useFriendshipStore from "../../../../../store/useFriendshipStore";
import UserListItem from "../UserListItem";
import { motion } from "motion/react";
import RenderActionButtons from "../RelationshipActionMenu";
import { FriendRequestsEmptyState } from "../EmptyStates";

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

  function SentRenderActions(user, requestId) {
    return (
      <RenderActionButtons
        user={user}
        status="outgoing"
        requestId={requestId}
      />
    );
  }

  function ReceivedRenderActions(user, requestId) {
    return (
      <RenderActionButtons
        user={user}
        status="incoming"
        requestId={requestId}
      />
    );
  }

  const hasSent = pendingSentRequests?.length > 0;
  const hasReceived = pendingReceivedRequests?.length > 0;

  if (!hasSent && !hasReceived) {
    return <FriendRequestsEmptyState />;
  }

  return (
    <motion.div
      initial={{ x: 30 }}
      animate={{ x: 0 }}
      exit={{ x: -30 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
      className="mt-6 mb-4"
    >
      <div className="flex flex-col gap-4 mt-5">
        <h3>Sent</h3>

        {hasSent ? (
          <UserListItem
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
          <UserListItem
            users={pendingReceivedRequests.map((req) => req.user1)}
            RenderActions={ReceivedRenderActions}
            requestId={pendingReceivedRequests.map((req) => req._id)}
          />
        ) : (
          <div>You don’t have any received requests.</div>
        )}
      </div>
    </motion.div>
  );
};

export default FriendRequests;
