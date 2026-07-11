import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerParticipantListener(socket) {
  socket.on(SOCKET_EVENTS.ADD_PARTICIPANT, (data) => {
    useChatStore.setState((state) => {
      if (!state.currentConversation) return state;
      if (state.currentConversation._id !== data.groupId) return state;

      return {
        currentConversation: {
          ...state.currentConversation,
          participants: data.participants,
          participantRoles: {
            ...state.currentConversation.participantRoles,
            ...Object.fromEntries(
              data.newParticipantRoles.map((p) => [p._id, p.role]),
            ),
          },
        },
        participantsData: [...state.participantsData, ...data.newlyAdded],
        messages: [...state.messages, data.systemMessage],
      };
    });
  });

  socket.on(SOCKET_EVENTS.REMOVE_PARTICIPANT, (data) => {
    const removedParticipantsIdSet = new Set(data.removedParticipantsId);

    useChatStore.setState((state) => {
      if (!state.currentConversation) return state;
      if (state.currentConversation._id !== data.groupId) return state;

      const roles = { ...state.currentConversation.participantRoles };

      for (const id of data.removedParticipantsId) {
        delete roles[id];
      }

      return {
        currentConversation: {
          ...state.currentConversation,
          participants: data.participants,
          participantRoles: roles,
        },
        participantsData: state.participantsData.filter(
          (participant) => !removedParticipantsIdSet.has(participant._id),
        ),
        messages: [...state.messages, data.systemMessage],
      };
    });
  });
}
