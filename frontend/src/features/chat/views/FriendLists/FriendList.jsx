import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import { FriendListsEmptyState } from "../../sidebar/components/EmptyStates";
import RenderActionButtons from "../../sidebar/components/RelationshipActionMenu";
import ConfirmBox from "../../sidebar/components/ConfirmBox";
import UserListItem from "../../sidebar/components/UserListItem";
import { slideInRight } from "../../../../components/motion/variants";
import Motion from "../../../../components/motion/Motion";

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
    <Motion variants={slideInRight} className="mt-6 mb-4">
      {friends?.length > 0 ? (
        <>
          <UserListItem
            users={friends}
            RenderActions={RenderActions}
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
    </Motion>
  );
};

export default FriendList;
