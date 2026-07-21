import { useQueryParams } from "../../../../../hooks/useQueryParams";
import useAuthStore from "../../../../../store/useAuthStore";
import ParticipantsContextMenu from "./ParticipantsContextMenu";

const ParticipantsListItems = ({
  contextMenu,
  currentConversationId,
  coords,
  openUserId,
  setOpenUserId,
  isOwner,
  isAdmin,
  blockedIds,
  sortedParticipants,
}) => {
  const { updateParams } = useQueryParams();
  const user = useAuthStore((state) => state.user);

  return (
    <>
      {sortedParticipants.slice(0, 5).map((participant) => (
        <div
          key={participant._id}
          className="cursor-pointer flex gap-4 relative rounded-md hover:bg-(--bg-secondary)/50 py-3 px-2 transition duration-300"
          onContextMenu={(e) => contextMenu(e, participant._id)}
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

          {openUserId === participant._id && (
            <ParticipantsContextMenu
              participant={participant}
              currentConversationId={currentConversationId}
              coords={coords}
              onClose={() => setOpenUserId(null)}
              isOwner={isOwner}
              isAdmin={isAdmin}
              userId={user._id}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default ParticipantsListItems;
