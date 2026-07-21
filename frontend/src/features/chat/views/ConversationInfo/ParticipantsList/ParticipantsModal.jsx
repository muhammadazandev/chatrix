import {
  RiArrowLeftLine,
  RiUserAddLine,
  RiUserMinusLine,
} from "@remixicon/react";
import IconsWrapper from "../../../../../components/IconsWrapper";
import Motion from "../../../../../motion/Motion";
import { slideInFromLeft } from "../../../../../motion/variants";
import Tooltip from "../../../../../components/Tooltip";
import useAuthStore from "../../../../../store/useAuthStore";
import { useQueryParams } from "../../../../../hooks/useQueryParams";
import { useState } from "react";
import { socket } from "../../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../../socket/events";
import toast from "react-hot-toast";
import ParticipantsContextMenu from "./ParticipantsContextMenu";

const ParticipantsModal = ({
  title,
  participants,
  selectable,
  action,
  onClose,
  blockedIds,
  groupId,
  setMenuCoords,
  setOpenUserId,
  participantsData,
  openUserId,
  menuCoords,
}) => {
  const user = useAuthStore((state) => state.user);
  const { updateParams } = useQueryParams();
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  function handleAction() {
    if (selectedParticipants.length === 0) return;
    let event = "";

    if (action === "add") event = SOCKET_EVENTS.ADD_PARTICIPANT;
    else if (action === "remove") event = SOCKET_EVENTS.REMOVE_PARTICIPANT;

    socket.emit(
      event,
      { participants: selectedParticipants, groupId },
      (res) => {
        if (!res.success) {
          toast.error(res?.message);
          return;
        }
        onClose();
      },
    );
  }

  function contextMenu(e, clickedUserId) {
    e.preventDefault();
    e.stopPropagation();

    setMenuCoords({
      x: e.clientX,
      y: e.clientY,
    });

    setOpenUserId(clickedUserId);
  }

  const isOwner = participantsData?.some(
    (part) => part._id === user._id && part.role === "owner",
  );

  const isAdmin = participantsData?.some(
    (part) => part._id === user._id && part.role === "admin",
  );

  return (
    <Motion
      variants={slideInFromLeft}
      transition="smooth"
      className="fixed max-w-[calc(100%/3.7)] min-w-[calc(100%/3.7)] top-0 h-screen z-100 bg-(--bg-primary) border-r border-(--foreground-primary)/20 py-5 flex flex-col"
    >
      <header className="w-full flex gap-4 items-center">
        <Tooltip content="Back" delay={[1000, 0]}>
          <button className="p-2 rounded-full" onClick={onClose}>
            <IconsWrapper icon={RiArrowLeftLine} />
          </button>
        </Tooltip>
        <h2>{title}</h2>
      </header>

      <div className="flex flex-col gap-3 pr-10 mt-10 overflow-y-auto flex-1">
        {participants?.length > 0 ? (
          participants?.map((participant) => (
            <div
              key={participant._id}
              className={`cursor-pointer flex gap-4 relative rounded-md py-3 px-4 transition duration-300 hover:bg-(--bg-secondary)/50 border ${selectedParticipants.includes(participant._id) ? "border-(--accent-color-secondary)/30" : "border-(--bg-primary)"}`}
              onContextMenu={(e) => contextMenu(e, participant._id)}
              onClick={() => {
                if (selectable) {
                  setSelectedParticipants((prevItems) => {
                    if (prevItems.includes(participant._id))
                      return prevItems.filter((pr) => pr !== participant._id);

                    return [...prevItems, participant._id];
                  });
                }
              }}
            >
              {!blockedIds.has(participant._id) && (
                <span
                  className={`rounded-full p-1.5 absolute bottom-3 left-3 ${participant.isOnline ? "bg-green-500" : "bg-(--foreground-secondary)/30"}`}
                />
              )}
              <img
                src={participant.profilePicture}
                alt={participant.username}
                className="rounded-full w-10 h-10 object-cover border border-(--foreground-secondary)/20"
                onClick={async () => {
                  await onClose();
                  setTimeout(() => {
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
                  }, 500);
                }}
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  {participant._id === user._id ? "You" : participant.username}
                </p>
                <p className="opacity-50 text-xs truncate">{participant.bio}</p>
              </div>

              {(participant.role === "owner" ||
                participant.role === "admin") && (
                <span className="text-xs opacity-60 self-center capitalize">
                  {participant.role}
                </span>
              )}

              {openUserId === participant._id && (
                <ParticipantsContextMenu
                  participant={participant}
                  currentConversationId={groupId}
                  coords={menuCoords}
                  onClose={() => setOpenUserId(null)}
                  isOwner={isOwner}
                  isAdmin={isAdmin}
                  userId={user._id}
                />
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex w-full justify-center items-center">
            <p>No friends to {action}</p>
          </div>
        )}
      </div>

      {action && (
        <div className="sticky py-5 flex justify-center">
          <Tooltip content={action === "add" ? "Add" : "Remove"}>
            <button
              type="button"
              className="rounded-full p-3 bg-(--accent-color-primary)"
              disabled={selectedParticipants.length > 0 ? false : true}
              onClick={() => handleAction()}
            >
              <IconsWrapper
                icon={action === "add" ? RiUserAddLine : RiUserMinusLine}
                size={26}
              />
            </button>
          </Tooltip>
        </div>
      )}
    </Motion>
  );
};

export default ParticipantsModal;
