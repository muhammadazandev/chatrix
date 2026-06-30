import { RiArrowLeftLine, RiUserLine } from "@remixicon/react";
import IconsWrapper from "../../../../components/IconsWrapper";
import Tooltip from "../../../../components/Tooltip";
import Motion from "../../../../motion/Motion";
import { slideInRight } from "../../../../motion/variants";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useSlidePanelClose from "../../../../hooks/useSlidePanelClose";
import useChatStore from "../../../../store/useChatStore";
import { useEffect, useState } from "react";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import PinnedSection from "./PinnedSection";
import ParticipantsList from "./ParticipantsList";
import ActionButtons from "./ActionButtons";

const ConversationInfo = () => {
  const { searchParams, updateParams } = useQueryParams();
  const conId = searchParams.get("conversationId");
  const { scope, close } = useSlidePanelClose();
  const currentConversation = useChatStore(
    (state) => state.currentConversation,
  );
  const verifyConversation = useChatStore((state) => state.verifyConversation);
  const pinnedMessages = useChatStore((state) => state.pinnedMessages);
  const [isTruncateBio, setIsTruncateBio] = useState(false);
  const updateOpenedUserProfile = useFriendshipStore(
    (state) => state.updateOpenedUserProfile,
  );
  const isDirect = currentConversation?.type === "direct";

  useEffect(() => {
    async function verify() {
      if ((!currentConversation && conId) || !pinnedMessages) {
        await verifyConversation(conId);
      }
    }
    verify();
  }, [conId, currentConversation, verifyConversation, pinnedMessages]);

  return (
    <Motion variants={slideInRight} ref={scope}>
      <header className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Tooltip content="Back" delay={[1000, 0]}>
            <button
              className="rounded-full p-2"
              onClick={async () => {
                await close();
                updateParams({ view: "conversation" });
              }}
            >
              <IconsWrapper icon={RiArrowLeftLine} />
            </button>
          </Tooltip>
          <p>Info</p>
        </div>
        {isDirect && (
          <div className="flex gap-3">
            <div className="rounded-full px-3 py-1.5 bg-(--accent-color-primary)/20 border border-(--foreground-secondary)/30 text-sm text-center">
              {currentConversation?.isOnline ? "Online" : "Offline"}
            </div>

            <Tooltip content="Open Profile">
              <button
                className="p-2 rounded-full"
                onClick={() => {
                  updateOpenedUserProfile(null); // To remove old state

                  updateParams(
                    {
                      view: "profile",
                      userId: currentConversation.friendId,
                    },
                    true,
                  );
                }}
              >
                <IconsWrapper icon={RiUserLine} size={18} />
              </button>
            </Tooltip>
          </div>
        )}
      </header>

      <div className="flex flex-col mt-5">
        <div className="flex justify-center">
          <img
            src={currentConversation?.avatar}
            alt={currentConversation?.name}
            className="rounded-full h-40 w-40 object-cover shadow-[0_5px_10px_var(--bg-secondary)]"
          />
        </div>

        <div className="flex flex-col gap-5 px-3">
          <div className="mt-15">
            <h4 className="opacity-50">Name</h4>
            <p className="pt-4">{currentConversation?.name}</p>
          </div>

          {isDirect && (
            <div>
              <h4 className="opacity-50">Bio</h4>
              <p
                className={`pt-4 ${isTruncateBio ? "truncate max-w-full" : ""} cursor-pointer`}
                onClick={() => setIsTruncateBio(!isTruncateBio)}
              >
                {currentConversation?.bio}
              </p>
            </div>
          )}

          <div className="mt-5">
            <h4 className="opacity-50">Pin messages</h4>

            {currentConversation && pinnedMessages && (
              <PinnedSection
                currentConversation={currentConversation}
                pinnedMessages={pinnedMessages}
              />
            )}
          </div>

          {!isDirect && currentConversation && (
            <div className="mt-5">
              <ParticipantsList currentConversation={currentConversation} />
            </div>
          )}

          <div className="mt-5">
            {currentConversation && (
              <ActionButtons currentConversation={currentConversation} close={close} />
            )}
          </div>
        </div>
      </div>
    </Motion>
  );
};

export default ConversationInfo;
