function verifyParticipant(conversation, userId) {
  return conversation.participants.some((id) => id.toString() === userId);
}

export default verifyParticipant;
