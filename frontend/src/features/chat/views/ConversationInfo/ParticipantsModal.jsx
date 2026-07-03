import {
  RiArrowLeftLine,
  RiUserAddLine,
  RiUserMinusLine,
} from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import Motion from "../../../../motion/Motion";
import { slideInFromLeft } from "../../../../motion/variants";
import Tooltip from "../../../../components/Tooltip";
import useAuthStore from "../../../../store/useAuthStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { useState } from "react";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import toast from "react-hot-toast";

const ParticipantsModal = ({
  title,
  participants,
  selectable,
  action,
  onClose,
  blockedIds,
  groupId,
}) => {
  const user = useAuthStore((state) => state.user);
  const { updateParams } = useQueryParams();
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  function handleOnPerformAction() {
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
        {participants?.map((participant) => (
          <div
            key={participant._id}
            className={`cursor-pointer flex gap-4 relative rounded-md py-3 px-4 transition duration-300 hover:bg-(--bg-secondary)/50 border ${selectedParticipants.includes(participant._id) ? "border-(--accent-color-secondary)/30" : "border-(--bg-primary)"}`}
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

            {(participant.role === "owner" || participant.role === "admin") && (
              <span className="text-xs opacity-60 self-center capitalize">
                {participant.role}
              </span>
            )}
          </div>
        ))}
      </div>

      {action && (
        <div className="sticky py-5 flex justify-center">
          <Tooltip content={action === "add" ? "Add" : "Remove"}>
            <button
              type="button"
              className="rounded-full p-3 bg-(--accent-color-primary)"
              disabled={selectedParticipants.length > 0 ? false : true}
              onClick={() => handleOnPerformAction()}
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
