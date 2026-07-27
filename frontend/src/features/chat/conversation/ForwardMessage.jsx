import { useMemo, useState } from "react";
import { RiCheckLine, RiCloseLine, RiSearchLine } from "@remixicon/react";
import Motion from "../../../motion/Motion";
import { popLift } from "../../../motion/variants";
import useMessageUiStore from "../../../store/useMessageUiStore";
import IconsWrapper from "../../../components/IconsWrapper";
import Tooltip from "../../../components/Tooltip";
import { SOCKET_EVENTS } from "../../../socket/events";
import { socket } from "../../../socket/socket";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import useFriendshipStore from "../../../store/useFriendshipStore";
import useMediaComposer from "../../../hooks/useMediaComposer";

const ForwardMessage = ({ forwardMessage, conversations }) => {
  const [search, setSearch] = useState("");
  const [isForwarding, setIsForwarding] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [searchParam] = useSearchParams();
  const currentConversationId = searchParam.get("conversationId");
  const setForwardMessage = useMessageUiStore(
    (state) => state.setForwardMessage,
  );
  const { sendMessage } = useMediaComposer();
  const blocked = useFriendshipStore((state) => state.blocked);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    // Create a set for fast O(1) lookups
    const blockedIds = new Set(blocked.map((b) => b._id));

    return conversations.filter((con) => {
      if (con._id === currentConversationId) return false;

      if (con.friendId && blockedIds.has(con.friendId)) return false;

      if (!query) return true;

      return con.title.toLowerCase().includes(query);
    });
  }, [search, conversations, currentConversationId, blocked]);

  function toggleConversation(conversationId) {
    setSelectedConversations((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId],
    );
  }

  async function handleForward() {
    const data = {
      messageId: forwardMessage?.id,
      conversationIds: selectedConversations,
    };
    setIsForwarding(true);

    if (forwardMessage.messageType === "text") {
      socket.emit(SOCKET_EVENTS.FORWARD_MESSAGE, data, (res) => {
        setIsForwarding(false);
        if (!res?.success) {
          toast.error(res?.message);
        }
      });
    } else {
      const res = await fetch(forwardMessage.messageUrl);

      if (!res.ok) return toast.error("File not found");

      const blob = await res.blob();
      const file = new File([blob], forwardMessage.originalName, {
        type: forwardMessage.mimeType,
      });

      await Promise.all(
        selectedConversations.map((conversationId) => {
          const previewUrl = URL.createObjectURL(file);

          return sendMessage({
            conversationId,
            file,
            previewUrl,
          });
        }),
      );

      setIsForwarding(false);
    }

    setForwardMessage({});
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-99"
        onClick={() => {
          if (!isForwarding) setForwardMessage({});
        }}
      />

      <Motion
        variants={popLift}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[85vh] w-130 bg-(--bg-primary) rounded-xl border border-(--foreground-secondary)/20 z-100 flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-(--foreground-secondary)/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg text-(--foreground-primary)">
                Forward Message
              </h2>

              <p className="text-xs opacity-60">
                {selectedConversations.length} selected
              </p>
            </div>

            <Tooltip content="Cancel" delay={[1000, 0]}>
              <button
                disabled={isForwarding}
                onClick={() => setForwardMessage({})}
                className="p-2 rounded-full"
              >
                <IconsWrapper
                  icon={RiCloseLine}
                  size={22}
                  className="text-(--foreground-primary)"
                />
              </button>
            </Tooltip>
          </div>

          <div className="mt-4 relative">
            <IconsWrapper
              icon={RiSearchLine}
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-(--bg-secondary) rounded-lg pl-10 pr-4 py-2.5 outline-none text-sm border border-(--foreground-secondary)/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((con) => {
              const isSelected = selectedConversations.includes(con._id);

              return (
                <div
                  key={con._id}
                  onClick={() => toggleConversation(con._id)}
                  className="group p-3.5 flex items-center gap-4 transition-all duration-200 rounded-lg relative border-b border-(--foreground-secondary)/20 hover:bg-(--bg-secondary)/50 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                      isSelected
                        ? "bg-(--accent-color-primary) border-(--accent-color-primary)"
                        : "border-(--foreground-secondary)/40"
                    }`}
                  >
                    {isSelected && (
                      <IconsWrapper
                        icon={RiCheckLine}
                        size={12}
                        className="text-white"
                      />
                    )}
                  </div>

                  <div className="relative shrink-0">
                    <img
                      loading="lazy"
                      src={con.avatar}
                      alt={`${con.title} profile`}
                      className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-(--foreground-primary) truncate">
                      {con.title}
                    </h3>

                    <p className="text-xs font-medium opacity-50 truncate mt-0.5">
                      {con.type === "group"
                        ? `${con.membersCount} members`
                        : con.lastMessageText || ""}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm opacity-50">No conversations found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-(--foreground-secondary)/20">
          <button
            disabled={!selectedConversations.length || isForwarding}
            className="w-full py-3 rounded-lg bg-(--accent-color-primary) text-white font-semibold"
            onClick={handleForward}
          >
            Forward ({selectedConversations.length})
          </button>
        </div>
      </Motion>
    </>
  );
};

export default ForwardMessage;
