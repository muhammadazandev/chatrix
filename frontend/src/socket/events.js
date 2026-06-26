export const SOCKET_EVENTS = {
  // Presence
  FRIEND_ONLINE: "friend_online",
  FRIEND_OFFLINE: "friend_offline",

  // Conversation
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  CONVERSATION_UPDATED: "conversation_updated",

  // Messages
  NEW_MESSAGE: "new_message",
  EDIT_MESSAGE: "edit_message",
  DELETE_MESSAGE: "delete_message",
  FORWARD_MESSAGE: "forward_message",

  // Typing
  START_TYPING: "start_typing",
  STOP_TYPING: "stop_typing",
  UPDATE_TYPING: "update_typing",
};
