import { motion } from "motion/react";
import useFriendshipStore from "../../../../../store/useFriendshipStore";
import { useEffect, useState } from "react";
import UserListItem from "../UserListItem";
import RenderActionButtons from "../RelationshipActionMenu";
import { BlockEmptyState } from "../EmptyStates";

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

  async function unblock(userId) {
    await unblockUser(userId);
  }

  function RenderActions(user) {
    return <RenderActionButtons user={user} status="blocked" />;
  }

  return (
    <motion.div
      className="mt-6 mb-4"
      initial={{ x: 30 }}
      animate={{ x: 0 }}
      exit={{ x: -30 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
    >
      {users?.length > 0 ? (
        <UserListItem
          users={users}
          RenderActions={RenderActions}
          isShowBlockButton={false}
        />
      ) : (
        <BlockEmptyState />
      )}
    </motion.div>
  );
};

export default Blocked;
