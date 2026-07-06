import Conversation from "../../../models/conversation.model.js";
import verifyParticipant from "../../../utils/verifyConversationParticipant.js";
import { typingUsers } from "../../socket.store.js";

export const registerConversationConnections = (io, socket) => {
  const userId = socket.user.userId.toString();

  socket.on("join_conversation", async (conversationId, callback) => {
    console.log(socket.id, "joined", conversationId);

    try {
      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return callback?.({
          success: false,
          message: "Conversation not found",
        });
      }

      const isPartcipant = verifyParticipant(conversation, userId);

      if (!isPartcipant) {
        return callback?.({
          success: false,
          message:
            "Access denied. You are not a participant in this conversation.",
        });
      }

      if (socket.currentConversation) {
        socket.leave(socket.currentConversation);
      }

      for (const key of typingUsers) {
        if (key.startsWith(`${socket.id}:`)) {
          typingUsers.delete(key);
        }
      }

      socket.currentConversation = conversationId;

      socket.join(`conversation:${conversationId}`);

      console.log("After join:");
      console.log(socket.rooms);

      callback?.({
        success: true,
        message: "Successfully joined conversation room",
      });
    } catch (error) {
      console.error(error);
      callback?.({ success: false, message: "Internal server error" });
    }
  });

  socket.on("leave_conversation", (conversationId) => {
    if (socket.currentConversation === conversationId) {
      socket.leave(`conversation:${conversationId}`);
      socket.currentConversation = null;
    }
  });
};
