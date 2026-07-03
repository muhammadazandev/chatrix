import { useEffect, useMemo, useState } from "react";
import useChatStore from "../../../../store/useChatStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useAuthStore from "../../../../store/useAuthStore";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import IconsWrapper from "../../../../components/IconsWrapper";
import { RiUserAddLine, RiUserMinusLine } from "@remixicon/react";
import ParticipantsModal from "./ParticipantsModal";
import { AnimatePresence } from "motion/react";

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
  const blocked = useFriendshipStore((state) => state.blocked);
  const friends = useFriendshipStore((state) => state.friends);
  const [participantsModal, setParticipantsModal] = useState("");

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

  const isOwner = participantsData?.some(
    (part) => part._id === user._id && part.role === "owner",
  );

  const isAdmin = participantsData?.some(
    (part) => part._id === user._id && part.role === "admin",
  );

  const participantIds = useMemo(
    () => new Set(participantsData.map((p) => p._id)),
    [participantsData],
  );

  const friendsNotInGroup = friends.filter(
    (friend) => !participantIds.has(friend._id),
  );

  const participantsToRemove = sortedParticipants.filter((part) => {
    if (isOwner) return part._id !== user._id;
    if (isAdmin) return part.role === "member";

    return false;
  });

  const modalConfig = useMemo(() => {
    switch (participantsModal) {
      case "view":
        return {
          title: "Participants",
          participants: sortedParticipants,
          selectable: false,
          action: null,
        };

      case "add":
        return {
          title: "Add Participants",
          participants: friendsNotInGroup,
          selectable: true,
          action: "add",
        };

      case "remove":
        return {
          title: "Remove Participants",
          participants: participantsToRemove,
          selectable: true,
          action: "remove",
        };

      default:
        return null;
    }
  }, [
    participantsModal,
    sortedParticipants,
    friendsNotInGroup,
    participantsToRemove,
  ]);

  return (
    <div className="flex flex-col gap-3">
      <h4 className="opacity-50">
        Participants
        <span className="ml-2">({participantsData?.length})</span>
      </h4>
      {(isOwner || isAdmin) &&
        ["add", "remove"].map((ar) => (
          <button
            key={ar}
            className="flex gap-4 rounded-md py-3 px-2 no-hover hover:bg-(--bg-secondary)/50 items-center"
            onClick={() => setParticipantsModal(ar)}
          >
            <span className="p-2 bg-(--accent-color-primary) rounded-full">
              <IconsWrapper
                icon={ar === "add" ? RiUserAddLine : RiUserMinusLine}
              />
            </span>
            {ar === "add" ? "Add" : "Remove"} Participant
          </button>
        ))}
      {sortedParticipants.slice(0, 5).map((participant) => (
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
              updateParams({
                view: "profile",
                userId: participant._id,
              });
            }
          }}
        >
          {!blockedIds.has(participant._id) && (
            <span
              className={`rounded-full p-1.5 absolute bottom-2 left-1 ${participant.isOnline ? "bg-green-500" : "bg-(--foreground-secondary)/30"}`}
            />
          )}
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
      ))}

      {sortedParticipants.length > 5 && (
        <button
          type="button"
          className="mt-2 text-sm opacity-70 hover:opacity-100 text-left no-hover"
          onClick={() => setParticipantsModal("view")}
        >
          Show All participants
        </button>
      )}

      <AnimatePresence>
        {modalConfig && (
          <ParticipantsModal
            {...modalConfig}
            onClose={() => setParticipantsModal("")}
            blockedIds={blockedIds}
            groupId={currentConversation._id}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantsList;
