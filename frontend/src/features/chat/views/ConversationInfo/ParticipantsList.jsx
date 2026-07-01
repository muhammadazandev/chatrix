import { useEffect, useMemo, useState } from "react";
import useChatStore from "../../../../store/useChatStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useAuthStore from "../../../../store/useAuthStore";
import useFriendshipStore from "../../../../store/useFriendshipStore";

const ROLE_ORDER = {
  owner: 0,
  admin: 1,
  member: 2,
};

const ParticipantsList = ({ currentConversation }) => {
  const getParticipantsData = useChatStore(
    (state) => state.getParticipantsData,
  );
  const participantsData = useChatStore((state) => state.participantsData);
  const user = useAuthStore((state) => state.user);
  const { updateParams } = useQueryParams();
  const [visibleCount, setVisibleCount] = useState(3);
  const blocked = useFriendshipStore((state) => state.blocked);

  useEffect(() => {
    async function get() {
      await getParticipantsData(currentConversation._id);
    }
    get();
  }, [currentConversation._id, getParticipantsData]);

  const sortedParticipants = useMemo(() => {
    return [...(participantsData ?? [])].sort((a, b) => {
      return ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
    });
  }, [participantsData]);

  const blockedIds = useMemo(
    () => new Set(blocked.map((b) => b._id)),
    [blocked],
  );

  const visibleParticipants = sortedParticipants.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-3">
      <h4 className="opacity-50">
        Participants
        <span className="ml-2">({participantsData?.length})</span>
      </h4>

      {visibleParticipants.map((participant) => (
          <div
            key={participant._id}
            className="cursor-pointer flex gap-4 relative rounded-md hover:bg-(--bg-secondary)/50 py-3 px-2 transition duration-300"
            onClick={() => {
              if (participant._id === user._id) {
                updateParams(
                  {
                    view: "settings",
                    tab: "profile",
                  },
                  true,
                );
              } else {
                updateParams(
                  {
                    view: "profile",
                    userId: participant._id,
                  },
                  true,
                );
              }
            }}
          >
            {!blockedIds.has(participant._id) && (
            <span
              className={`rounded-full p-1.5 absolute bottom-2 left-1 ${participant.isOnline ? "bg-green-500" : "bg-(--foreground-secondary)/30"}`}
            />)}
            <img
              src={participant.profilePicture}
              alt={participant.username}
              className="rounded-full w-10 h-10 object-cover border border-(--foreground-secondary)/20"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm">
                {participant._id === user._id ? "You" : participant.username}
              </p>
              <p className="opacity-50 text-xs truncate">{participant.bio}</p>
            </div>

            {(participant.role === "owner" || participant.role === "admin") && (
              <span className="text-xs opacity-60 self-center capitalize">
                {participant.role}
              </span>
            )}
          </div>
        )
      )}

      {visibleCount < sortedParticipants.length && (
        <button
          type="button"
          className="mt-2 text-sm opacity-70 hover:opacity-100 text-left no-hover"
          onClick={() => setVisibleCount((count) => count + 20)}
        >
          Show {Math.min(20, sortedParticipants.length - visibleCount)} more
        </button>
      )}
    </div>
  );
};

export default ParticipantsList;
