import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import { FriendListsEmptyState } from "../../sidebar/components/EmptyStates";
import RenderActionButtons from "../../sidebar/components/RelationshipActionMenu";
import ConfirmBox from "../../sidebar/components/ConfirmBox";
import UserListItem from "../../sidebar/components/UserListItem";

const FriendList = () => {
  const getAllFriends = useFriendshipStore((state) => state.getAllFriends);
  const friends = useFriendshipStore((state) => state.friends);
  const unfriend = useFriendshipStore((state) => state.unfriend);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmBoxUserId, setConfirmBoxUserId] = useState(undefined);

  useEffect(() => {
    async function get() {
      await getAllFriends();
    }

    get();
  }, []);

  async function unfriendFriend(userId) {
    await unfriend(userId);
    setIsConfirmOpen(false);
    setConfirmBoxUserId(undefined);
  }

  function RenderActions(user) {
    return (
      <RenderActionButtons
        user={user}
        status="friends"
        setIsConfirmOpen={setIsConfirmOpen}
        setConfirmBoxUserId={setConfirmBoxUserId}
      />
    );
  }

  return (
    <motion.div
      className="mt-6 mb-4"
      initial={{ x: 30 }}
      animate={{ x: 0 }}
      exit={{ x: -30 }}
      transition={{ duration: 0.5, ease: "anticipate" }}
    >
      {friends?.length > 0 ? (
        <>
          <UserListItem
            users={friends}
            RenderActions={RenderActions}
            isUnfriendButton={true}
          />
          <AnimatePresence>
            {isConfirmOpen && confirmBoxUserId && (
              <ConfirmBox
                confirmWhat="unfriend"
                onConfirm={() => unfriendFriend(confirmBoxUserId)}
                setIsConfirmOpen={setIsConfirmOpen}
              />
            )}
          </AnimatePresence>
        </>
      ) : (
        <FriendListsEmptyState />
      )}
    </motion.div>
  );
};

export default FriendList;
