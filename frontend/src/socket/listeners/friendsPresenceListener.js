import useChatStore from "../../store/useChatStore";
import useFriendshipStore from "../../store/useFriendshipStore";
import { SOCKET_EVENTS } from "../events";

function setCurrentConversationPresence(userId, isOnline) {
  useChatStore.setState((state) => {
    const con = state.currentConversation;

    if (!con) return state;

    if (con.type === "direct") {
      if (con.friendId !== userId) return state;

      return {
        currentConversation: {
          ...con,
          isOnline,
        },
      };
    }

    const exists = con.participants.some((p) => p._id === userId);

    if (!exists) return state;

    return {
      currentConversation: {
        ...con,
        participants: con.participants.map((participant) =>
          participant._id === userId
            ? { ...participant, isOnline }
            : participant,
        ),
      },
    };
  });
}

function updateParticipantsData(userId, isOnline) {
  if (useChatStore.getState().participantsData) {
    useChatStore.setState((state) => ({
      participantsData: state.participantsData.map((participant) => {
        if (participant._id !== userId) return participant;

        return {
          ...participant,
          isOnline: isOnline,
        };
      }),
    }));
  }
}

export const registerFriendsListener = (socket) => {
  const updateFriendStatus = useFriendshipStore.getState().updateFriendStatus;

  socket.on(SOCKET_EVENTS.FRIEND_ONLINE, ({ userId }) => {
    updateFriendStatus(userId, true);

    setCurrentConversationPresence(userId, true);

    updateParticipantsData(userId, true);
  });

  socket.on(SOCKET_EVENTS.FRIEND_OFFLINE, ({ userId }) => {
    updateFriendStatus(userId, false);

    setCurrentConversationPresence(userId, false);

    updateParticipantsData(userId, false);
  });
};
