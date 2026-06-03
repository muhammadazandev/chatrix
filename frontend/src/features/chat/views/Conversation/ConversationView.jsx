import { useEffect } from "react";
import useChatStore from "../../../../store/useChatStore";
import { useSearchParams } from "react-router-dom";

const ConversationView = () => {
  const getAllConversations = useChatStore(
    (state) => state.getAllConversations,
  );
  const allConversations = useChatStore((state) => state.allConversations);
  const setCurrentConversationId = useChatStore(
    (state) => state.setCurrentConversationId,
  );
  const verifyConversation = useChatStore((state) => state.verifyConversation);
  const [searchParams, setSearchParams] = useSearchParams();

  const sortedConversations = [...allConversations].sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
  );

  const updateConversationIdParam = (conversationId) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (params.get("conversationId") === conversationId) {
        return params;
      } else {
        params.set("conversationId", conversationId);
      }

      return params;
    });
  };

  async function handleConversationClick(conversationId) {
    await verifyConversation(conversationId);
    setCurrentConversationId(conversationId);
    updateConversationIdParam(conversationId);
  }

  useEffect(() => {
    getAllConversations();
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-1">
      {sortedConversations?.map((con) => {
        return (
          <div
            key={con._id}
            className="group p-3.5 flex items-center justify-between gap-4 transition-all duration-200 rounded-lg relative border-b border-(--foreground-secondary)/30 hover:bg-(--bg-secondary)/50 cursor-pointer"
            onClick={() => handleConversationClick(con._id)}
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="relative shrink-0">
                <img
                  src={con.friend.profilePicture}
                  alt={`${con.friend.username} profile`}
                  className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40"
                />
              </div>

              <div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-semibold text-(--foreground-primary) tracking-wide">
                    {con.friend.username}
                  </h3>
                </div>
                <p className="text-xs font-medium opacity-50 truncate max-w-60 mt-0.5">
                  {con.lastMessageText || ""}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationView;
