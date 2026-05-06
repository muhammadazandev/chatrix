import { RiMore2Fill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RiUserForbidFill,
  RiFileCopyFill,
  RiUserSharedFill,
} from "@remixicon/react";
import ConfirmBox from "./ConfirmBox";
import useFriendshipStore from "../../../../store/useFriendshipStore";

const UserListItem = ({
  users = [],
  requestId = [],
  RenderActions,
  isShowBlockButton = true,
  isUnfriendButton = false,
}) => {
  const [moreOpenIndex, setMoreOpenIndex] = useState(null);
  const [isConfirmOpenIndex, setIsConfirmOpenIndex] = useState(false);
  const blockUser = useFriendshipStore((state) => state.blockUser);

  async function runBlockUser(userId) {
    await blockUser(userId);

    setIsConfirmOpenIndex(false);
  }

  return (
    <div className="flex flex-col gap-2">
      {users?.map((user, index) => (
        <div
          key={user._id}
          className={`p-4 flex gap-3 cursor-pointer hover:bg-(--bg-secondary) transition-colors duration-200 rounded-lg relative border-b border-(--foreground-primary)/20 has-[.child:hover]:bg-transparent friends friend-${index}`}
        >
          <img
            src={user.profilePicture}
            alt={`${user.username} profile`}
            className="rounded-full w-11 h-11 object-cover border-2 border-transparent hover:border-(--accent-color-primary) transition duration-600"
          />

          <div className="flex flex-col">
            <h3>{user.username}</h3>
            <p className="text-sm opacity-40 truncate">
              {user.bio || "No bio available"}
            </p>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-full"
              onClick={() =>
                setMoreOpenIndex(moreOpenIndex === index ? null : index)
              }
              onBlur={() => setMoreOpenIndex(false)}
            >
              <IconsWrapper icon={RiMore2Fill} />
            </button>

            <AnimatePresence>
              {moreOpenIndex === index && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0, position: "absolute" }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "anticipate" }}
                >
                  <div className="flex flex-col gap-2 *:w-50 absolute left-22 -bottom-10 bg-(--bg-primary) border border-(--foreground-primary)/20 child rounded *:z-50">
                    {
                      <>
                        {!isUnfriendButton &&
                          RenderActions?.(user, requestId[index])}

                        {isShowBlockButton && (
                          <>
                            <button
                              type="button"
                              className="rounded p-2.5 inline-flex gap-4 items-center"
                            >
                              <IconsWrapper icon={RiFileCopyFill} size={18} />
                              Copy profile link
                            </button>

                            <button
                              type="button"
                              className="rounded p-2.5 inline-flex gap-4 items-center"
                            >
                              <IconsWrapper icon={RiUserSharedFill} size={18} />
                              Share user profile
                            </button>
                          </>
                        )}

                        {isShowBlockButton && (
                          <div className="w-full bg-red-800 opacity-20 h-[0.25px]" />
                        )}

                        {isShowBlockButton && (
                          <>
                            <button
                              type="button"
                              className="rounded p-2.5 inline-flex gap-4 items-center"
                              onClick={() => {
                                setIsConfirmOpenIndex(
                                  isConfirmOpenIndex === index ? null : index,
                                );
                              }}
                              onBlur={() => {
                                setIsConfirmOpenIndex(false);
                              }}
                            >
                              <IconsWrapper icon={RiUserForbidFill} size={18} />
                              Block user
                            </button>
                          </>
                        )}
                        {isUnfriendButton &&
                          RenderActions?.(user, requestId[index])}
                      </>
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isConfirmOpenIndex === index && (
                <ConfirmBox
                  confirmWhat="block"
                  setIsConfirmOpen={setIsConfirmOpenIndex}
                  onConfirm={() => runBlockUser(user._id)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListItem;
