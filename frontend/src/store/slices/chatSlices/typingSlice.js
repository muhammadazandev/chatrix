export const createTypingSlice = (set) => ({
  typingUsersByConversation: {},

  addTypingUser: (conversationId, userId, username) => {
    set((state) => {
      const current = state.typingUsersByConversation[conversationId] || [];

      if (current.some((user) => user.userId === userId)) return state;

      return {
        typingUsersByConversation: {
          ...state.typingUsersByConversation,
          [conversationId]: [...current, { userId, username }],
        },
      };
    });
  },

  removeTypingUser: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsersByConversation[conversationId] || [];
      const updated = current.filter((user) => user.userId !== userId);
      const copy = { ...state.typingUsersByConversation };

      if (updated.length === 0) {
        delete copy[conversationId];
      } else {
        copy[conversationId] = updated;
      }

      return {
        typingUsersByConversation: copy,
      };
    });
  },
});
