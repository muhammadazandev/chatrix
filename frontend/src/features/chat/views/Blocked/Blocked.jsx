import { lazy, Suspense, useEffect, useState } from "react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import Motion from "../../../../motion/Motion";
import { slideInRight } from "../../../../motion/variants";
import UserListItems from "../../sidebar/userListItems/UserListItems";
import RenderActionButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import Loader from "../../../../components/Loader";

const BlockEmptyState = lazy(() =>
  import("../../sidebar/components/EmptyStates").then((module) => ({
    default: module.BlockEmptyState,
  })),
);

const Blocked = () => {
  const getAllBlockedUsers = useFriendshipStore(
    (state) => state.getAllBlockedUsers,
  );
  const blocked = useFriendshipStore((state) => state.blocked);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function get() {
      await getAllBlockedUsers();
    }

    get();
  }, []);

  useEffect(() => {
    if (blocked?.length > 0) {
      setUsers(blocked.map((bl) => bl.user));
    }
  }, [blocked]);

  function RenderActions(user, setMoreOpenIndex) {
    return (
      <RenderActionButtons
        user={user}
        status="blocked"
        setMoreOpenIndex={setMoreOpenIndex}
      />
    );
  }

  return (
    <Motion variants={slideInRight} className="mt-6 mb-4">
      {users?.length > 0 ? (
        <UserListItems
          users={users}
          RenderActions={RenderActions}
          isShowBlockButton={false}
        />
      ) : (
        <Suspense fallback={<Loader />}>
          <BlockEmptyState />
        </Suspense>
      )}
    </Motion>
  );
};

export default Blocked;
