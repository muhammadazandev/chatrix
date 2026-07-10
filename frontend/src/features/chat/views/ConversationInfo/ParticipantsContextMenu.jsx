import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiUserUnfollowLine,
  RiUser2Line,
} from "@remixicon/react";

import ContextMenu from "../../../../components/ContextMenu";
import { socket } from "../../../../socket/socket";
import { SOCKET_EVENTS } from "../../../../socket/events";
import toast from "react-hot-toast";
import { useQueryParams } from "../../../../hooks/useQueryParams";

const ParticipantsContextMenu = ({
  participant,
  currentConversationId,
  coords,
  onClose,
  isOwner,
  isAdmin,
  userId,
}) => {
  const { updateParams } = useQueryParams();

  const handlePromote = () => {
    socket.emit(
      SOCKET_EVENTS.PROMOTE_PARTICIPANT,
      {
        toPromoteId: participant._id,
        groupId: currentConversationId,
      },
      (res) => {
        if (!res?.success) return toast.error(res?.message);
      },
    );
  };

  const handleDemote = () => {
    socket.emit(
      SOCKET_EVENTS.DEMOTE_PARTICIPANT,
      {
        toDemoteId: participant._id,
        groupId: currentConversationId,
      },
      (res) => {
        if (!res?.success) return toast.error(res?.message);
      },
    );
  };

  const handleRemove = () => {
    socket.emit(
      SOCKET_EVENTS.REMOVE_PARTICIPANT,
      {
        participants: [participant._id],
        groupId: currentConversationId,
      },
      (res) => {
        if (!res?.success) return toast.error(res?.message);
      },
    );
  };

  function handleOpenProfile() {
    if (participant._id === userId) {
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
  }

  const items = [
    {
      label: "Open Profile",
      icon: RiUser2Line,
      onClick: handleOpenProfile,
    },

    {
      label: "Promote to Admin",
      icon: RiArrowUpLine,
      hidden: !(isOwner && participant.role === "member"),
      onClick: handlePromote,
    },

    {
      label: "Demote to Member",
      icon: RiArrowDownLine,
      hidden: !(isOwner && participant.role === "admin"),
      onClick: handleDemote,
    },

    {
      label: "Remove Participant",
      icon: RiUserUnfollowLine,
      danger: true,
      separator: true,
      hidden: !(
        (isOwner && participant.role !== "owner") ||
        (isAdmin && participant.role === "member")
      ),
      onClick: handleRemove,
    },
  ];

  return (
    <ContextMenu
      coords={coords}
      items={items}
      onClose={onClose}
      className="w-50"
    />
  );
};

export default ParticipantsContextMenu;
