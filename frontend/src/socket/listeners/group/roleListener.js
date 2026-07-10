import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerRolesListener(socket) {
  socket.on(SOCKET_EVENTS.PROMOTE_PARTICIPANT, (data) => {
    useChatStore.setState((state) => {
      if (
        state.currentConversation._id !== data.groupId ||
        state.participantsData.length === 0
      )
        return state;

      return {
        participantsData: state.participantsData.map((participant) => {
          if (participant._id === data.promotedParticipant) {
            return {
              ...participant,
              role: "admin",
            };
          }
          return participant;
        }),
      };
    });
  });

  socket.on(SOCKET_EVENTS.DEMOTE_PARTICIPANT, (data) => {
    useChatStore.setState((state) => {
      if (
        state.currentConversation._id !== data.groupId ||
        state.participantsData.length === 0
      )
        return state;

      return {
        participantsData: state.participantsData.map((participant) => {
          if (participant._id === data.demotedParticipant) {
            return {
              ...participant,
              role: "member",
            };
          }
          return participant;
        }),
      };
    });
  });
}
