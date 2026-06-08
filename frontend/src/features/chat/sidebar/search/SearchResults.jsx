import Loader from "../../../../components/Loader";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import UserListItems from "../userListItems/UserListItems";
import RenderActionButtons from "../userListItems/RelationshipActionMenu";
import ConfirmBox from "../../../../components/ConfirmBox";

const SearchResults = ({ results, isLoading }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmBoxUserId, setConfirmBoxUserId] = useState(null);
  const unfriend = useFriendshipStore((state) => state.unfriend);

  async function runUnfriend(userId) {
    await unfriend(userId);
    setIsConfirmOpen(false);
    setConfirmBoxUserId(null);
  }

  function RenderActions(
    user,
    setMoreOpenIndex,
    setIsConfirmOpen,
    setConfirmBoxUserId,
  ) {
    return (
      <RenderActionButtons
        user={user}
        status={user.relationshipStatus}
        requestId={user.requestId}
        setIsConfirmOpen={setIsConfirmOpen}
        setConfirmBoxUserId={setConfirmBoxUserId}
        setMoreOpenIndex={setMoreOpenIndex}
      />
    );
  }

  return (
    <div className="mt-8 mb-4">
      {isLoading ? (
        <div className="h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <UserListItems
            users={results}
            RenderActions={RenderActions}
            isShowBlockButton={true}
          />
          <AnimatePresence>
            {isConfirmOpen && (
              <ConfirmBox
                confirmWhat="unfriend"
                setIsConfirmOpen={setIsConfirmOpen}
                onConfirm={() => runUnfriend(confirmBoxUserId)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default SearchResults;
