import { useEffect, useMemo } from "react";
import useChatStore from "../store/useChatStore";
import useFriendshipStore from "../store/useFriendshipStore";

const ROLE_ORDER = {
  owner: 0,
  admin: 1,
  member: 2,
};

function useParticipantsData(conversationId, userId) {
  const getParticipantsData = useChatStore(
    (state) => state.getParticipantsData,
  );
  const participantsData = useChatStore((state) => state.participantsData);
  const blocked = useFriendshipStore((state) => state.blocked);
  const friends = useFriendshipStore((state) => state.friends);

  const sortedParticipants = useMemo(() => {
    return [...(participantsData ?? [])].sort((a, b) => {
      return ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
    });
  }, [participantsData]);

  const blockedIds = useMemo(
    () => new Set(blocked.map((b) => b._id)),
    [blocked],
  );

  const isOwner = participantsData?.some(
    (part) => part._id === userId && part.role === "owner",
  );

  const isAdmin = participantsData?.some(
    (part) => part._id === userId && part.role === "admin",
  );

  const participantIds = useMemo(
    () => new Set(participantsData.map((p) => p._id)),
    [participantsData],
  );

  const friendsNotInGroup = useMemo(
    () => friends.filter((friend) => !participantIds.has(friend._id)),
    [friends, participantIds],
  );
  
  const participantsToRemove = useMemo(() => {
    return sortedParticipants.filter((part) => {
      if (isOwner) return part._id !== userId;
      if (isAdmin) return part.role === "member";

      return false;
    });
  }, [sortedParticipants, isOwner, isAdmin, userId]);

  useEffect(() => {
    getParticipantsData(conversationId);
  }, [conversationId, getParticipantsData]);

  return {
    participantsData,
    isOwner,
    isAdmin,
    sortedParticipants,
    blockedIds,
    friendsNotInGroup,
    participantsToRemove,
  };
}

export default useParticipantsData;
