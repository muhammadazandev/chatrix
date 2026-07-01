import useChatStore from "../../../../store/useChatStore";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import PinnedMessages from "./PinnedMessages";
import { useQueryParams } from "../../../../hooks/useQueryParams";

const Header = () => {
  const { updateParams, searchParams } = useQueryParams();
  const conId = searchParams.get("conversationId");
  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );
  const verifyConversation = useChatStore((state) => state.verifyConversation);
  const pinnedMessages = useChatStore((state) => state.pinnedMessages);

  useEffect(() => {
    async function verify() {
      if (!currentConversation && conId) {
        await verifyConversation(conId);
      }
    }

    verify();
  }, [conId, currentConversation, verifyConversation]);

  const isDirect = currentConversation?.type === "direct";
  const onlineDotClasses =
    !isDirect || currentConversation.relationshipStatus === "blocked"
      ? "hidden"
      : currentConversation.isOnline
        ? "bg-green-500"
        : "bg-(--foreground-primary)/40";

  if (!currentConversation) return null;

  function subtitleText() {
    if (currentConversation?.relationshipStatus === "blocked") return "Blocked";

    if (isDirect) {
      return currentConversation.isOnline ? "Online" : "Offline";
    }

    const onlineCount = currentConversation.participants.filter(
      (p) => p.isOnline,
    ).length;

    return `${currentConversation.participants.length} members • ${onlineCount} online`;
  }

  return (
    <div>
      <div
        className="min-w-full px-3 py-2  bg-(--bg-primary) border-b border-(--foreground-primary)/20 cursor-pointer"
        onClick={() => updateParams({ view: "conversation-info" })}
      >
        <div className="p-3.5 flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="relative shrink-0">
              <span
                className={`inline-block p-1.5 mr-2 rounded-full opacity-50 absolute bottom-0 -left-1 ${onlineDotClasses}`}
              />
              <img
                loading="lazy"
                src={currentConversation.avatar}
                alt={`profile pic`}
                className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40"
              />
            </div>

            <div>
              <div className="overflow-hidden flex flex-col">
                <h2 className="text-md font-semibold text-(--foreground-primary) tracking-wide">
                  {currentConversation.name}
                </h2>

                <p className="text-xs opacity-50">{subtitleText()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AnimatePresence>
          {pinnedMessages.length > 0 && (
            <PinnedMessages pinnedMessages={pinnedMessages} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
