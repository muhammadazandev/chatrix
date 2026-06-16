import { useEffect } from "react";
import useChatStore from "../../../../store/useChatStore";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { ConversationEmptyState } from "../../sidebar/components/EmptyStates";

const ConversationView = () => {
  const getConversations = useChatStore((state) => state.getConversations);
  const conversations = useChatStore((state) => state.conversations);
  const verifyConversation = useChatStore((state) => state.verifyConversation);
  const { searchParams, updateParams } = useQueryParams();
  const sortedConversations = conversations
    ? [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
      )
    : [];

  async function handleConversationClick(conversationId) {
    await verifyConversation(conversationId);

    if (searchParams.get("conversationId") !== conversationId) {
      updateParams({ conversationId });
    }
  }

  useEffect(() => {
    getConversations();
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-1">
      {sortedConversations?.length > 0 ? (
        sortedConversations.map((con) => {
          return (
            <div
              key={con._id}
              className="group p-3.5 flex items-center justify-between gap-4 transition-all duration-200 rounded-lg relative border-b border-(--foreground-secondary)/30 hover:bg-(--bg-secondary)/50 cursor-pointer"
              onClick={() => handleConversationClick(con._id)}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <img
                    loading="lazy"
                    src={con.avatar}
                    alt={`${con.title} profile`}
                    className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40"
                  />
                </div>

                <div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-semibold text-(--foreground-primary) tracking-wide">
                      {con.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium opacity-50 truncate max-w-60 mt-0.5">
                    {con.lastMessageText || ""}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <ConversationEmptyState />
      )}
    </div>
  );
};

export default ConversationView;
