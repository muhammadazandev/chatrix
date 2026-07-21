const SystemMessage = ({ message }) => {
  function handleMultipleTargets(targets) {
    const formatter = new Intl.ListFormat("en", {
      style: "long",
      type: "conjunction",
    });

    if (targets.length === 1) return targets[0];
    if (targets.length > 1 && targets.length <= 3)
      return formatter.format(targets);
    if (targets.length > 3) return `${targets.length} participants`;
  }

  function renderSystemMessage() {
    if (!message) return;
    const actorName = message.metadata?.actor?.username;
    const targetNames = message.metadata?.targets
      ? handleMultipleTargets(
          message.metadata.targets.map((target) => target.username),
        )
      : null;

    switch (message.systemAction) {
      case "member_removed":
        return `${actorName} removed ${targetNames}`;

      case "member_added":
        return `${actorName} added ${targetNames}`;

      case "member_left":
        return `${actorName} left group`;

      case "member_promoted":
        return `${actorName} promoted ${targetNames} to admin`;

      case "member_demoted":
        return `${actorName} demoted ${targetNames} to member`;

      case "group_renamed":
        return `${actorName} (owner) changed name from ${message.metadata.oldValue} to ${message.metadata.newValue}`;

      case "group_photo_changed":
        return `${actorName} (owner) changed group photo`;

      default:
        return "";
    }
  }

  return (
    <div className="w-full flex justify-center opacity-90 tracking-wider my-2">
      <p className="bg-(--bg-secondary)/50 rounded-md px-4 py-2 text-[12px]">
        {renderSystemMessage()}
      </p>
    </div>
  );
};

export default SystemMessage;
