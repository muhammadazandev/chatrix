import { useSearchParams } from "react-router-dom";
import useChatStore from "../../../../store/useChatStore";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import PinnedMessages from "./PinnedMessages";

const Header = () => {
  const [searchParam] = useSearchParams();
  const conId = searchParam.get("conversationId");
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

  if (!currentConversation) return null;

  return (
    <div>
      <div className="min-w-full px-3 py-2  bg-(--bg-primary) border-b border-(--foreground-primary)/20">
        <div className="p-3.5 flex items-center justify-between gap-4 relative">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="relative shrink-0">
              <img
                loading="lazy"
                src={currentConversation.avatar}
                alt={`profile pic`}
                className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40"
              />
            </div>

            <div>
              <div className="overflow-hidden">
                <h2 className="text-md font-semibold text-(--foreground-primary) tracking-wide">
                  {currentConversation.name}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <AnimatePresence>
          {pinnedMessages.length > 0 && <PinnedMessages pinnedMessages={pinnedMessages} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;
