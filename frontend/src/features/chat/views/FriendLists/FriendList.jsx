import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import { FriendListsEmptyState } from "../../sidebar/components/EmptyStates";
ConfirmBox
import { slideInRight } from "../../../../motion/variants";
import Motion from "../../../../motion/Motion";
import UserListItems from "../../sidebar/userListItems/UserListItems";
import RenderActionButtons from "../../sidebar/userListItems/RelationshipActionMenu";
import ConfirmBox from "../../../../components/ConfirmBox";

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

  function RenderActions(user, setMoreOpenIndex) {
    return (
      <RenderActionButtons
        user={user}
        status="friends"
        setIsConfirmOpen={setIsConfirmOpen}
        setConfirmBoxUserId={setConfirmBoxUserId}
        setMoreOpenIndex={setMoreOpenIndex}
      />
    );
  }

  return (
    <Motion variants={slideInRight} className="mt-6 mb-4">
      {friends?.length > 0 ? (
        <>
          <UserListItems users={friends} RenderActions={RenderActions} />
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
