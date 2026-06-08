import { useEffect, useState } from "react";
import { BlockEmptyState } from "../../sidebar/components/EmptyStates";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import Motion from "../../../../motion/Motion";
import { slideInRight } from "../../../../motion/variants";
import UserListItems from "../../sidebar/userListItems/UserListItems";
import RenderActionButtons from "../../sidebar/userListItems/RelationshipActionMenu";

const Blocked = () => {
  const getAllBlockedUsers = useFriendshipStore(
    (state) => state.getAllBlockedUsers,
  );
  const blocked = useFriendshipStore((state) => state.blocked);
  const unblockUser = useFriendshipStore((state) => state.unblockUser);
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
    <Motion variants={slideInRight}
      className="mt-6 mb-4"
    >
      {users?.length > 0 ? (
        <UserListItems
          users={users}
          RenderActions={RenderActions}
          isShowBlockButton={false}
        />
      ) : (
        <BlockEmptyState />
      )}
    </Motion>
  );
};

export default Blocked;
