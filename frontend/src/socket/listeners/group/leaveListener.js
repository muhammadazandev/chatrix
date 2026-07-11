import useChatStore from "../../../store/useChatStore";
import { SOCKET_EVENTS } from "../../events";

export function registerLeaveListener(socket) {
  socket.on(SOCKET_EVENTS.LEAVE_GROUP, (data) => {
    useChatStore.setState((state) => {
      if (state.currentConversation?._id !== data.groupId) {
        return state;
      }

      return {
        currentConversation: {
          ...state.currentConversation,
          participants: state.currentConversation.participants.filter(
            (part) => part._id !== data.userId,
          ),
        },
        participantsData: state.participantsData.filter(
          (participant) => participant._id !== data.userId,
        ),
        messages: [...state.messages, data.systemMessage],
      };
    });
  });
}
