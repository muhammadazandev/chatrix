import { useSearchParams } from "react-router-dom";
import useChatStore from "../../../../store/useChatStore";
import { useEffect } from "react";

const Header = () => {
  const [searchParam] = useSearchParams();
  const conId = searchParam.get("conversationId");
  const conversationFriend = useChatStore((state) => state.conversationFriend);
  const verifyConversation = useChatStore((state) => state.verifyConversation);

  useEffect(() => {
    async function verify() {
      if (!conversationFriend && conId) {
        await verifyConversation(conId);
      }
    }

    verify();
  }, [conId, conversationFriend, verifyConversation]);

  if (!conversationFriend) return null;

  return (
    <div className="min-w-full px-3 py-2  bg-(--bg-primary) border-b border-(--foreground-primary)/20">
      <div className="p-3.5 flex items-center justify-between gap-4 relative">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img
              loading="lazy"
              src={conversationFriend.profilePicture}
              alt={`${conversationFriend.profilePicture} profile`}
              className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40"
            />
          </div>

          <div>
            <div className="overflow-hidden">
              <h2 className="text-md font-semibold text-(--foreground-primary) tracking-wide">
                {conversationFriend.username}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
