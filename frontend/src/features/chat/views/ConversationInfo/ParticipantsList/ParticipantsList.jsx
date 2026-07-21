import { useMemo, useState } from "react";
import { RiUserAddLine, RiUserMinusLine } from "@remixicon/react";
import ParticipantsModal from "./ParticipantsModal";
import { AnimatePresence } from "motion/react";
import ParticipantsListItems from "./ParticipantsListItems";
import IconsWrapper from "../../../../../components/IconsWrapper";
import useParticipantsData from "../../../../../hooks/useParticipantsData";
import useAuthStore from "../../../../../store/useAuthStore";

const ParticipantsList = ({ currentConversation }) => {
  const [menuCoords, setMenuCoords] = useState({});
  const [openUserId, setOpenUserId] = useState(null);
  const [participantsModal, setParticipantsModal] = useState("");
  const user = useAuthStore((state) => state.user);

  const {
    participantsData,
    isOwner,
    isAdmin,
    sortedParticipants,
    blockedIds,
    friendsNotInGroup,
    participantsToRemove,
  } = useParticipantsData(currentConversation?._id, user?._id);

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

  function contextMenu(e, clickedUserId) {
    e.preventDefault();
    e.stopPropagation();

    setMenuCoords({
      x: e.clientX,
      y: e.clientY,
    });

    setOpenUserId(clickedUserId);
  }

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

      <ParticipantsListItems
        contextMenu={contextMenu}
        currentConversationId={currentConversation._id}
        coords={menuCoords}
        setOpenUserId={setOpenUserId}
        openUserId={openUserId}
        isOwner={isOwner}
        isAdmin={isAdmin}
        blockedIds={blockedIds}
        sortedParticipants={sortedParticipants}
      />

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
            participantsData={participantsData}
            setMenuCoords={setMenuCoords}
            setOpenUserId={setOpenUserId}
            openUserId={openUserId}
            menuCoords={menuCoords}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantsList;
