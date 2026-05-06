import { useEffect, useState } from "react";
import useFriendshipStore from "../../../../../store/useFriendshipStore";
import UserListItem from "../UserListItem";
import { motion, AnimatePresence } from "motion/react";
import ConfirmBox from "../ConfirmBox";
import RenderActionButtons from "../RelationshipActionMenu";
import { FriendListsEmptyState } from "../EmptyStates";

const FriendsList = ({ setCurrentView }) => {
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
        <FriendListsEmptyState setCurrentView={setCurrentView} />
      )}
    </motion.div>
  );
};

export default FriendsList;
