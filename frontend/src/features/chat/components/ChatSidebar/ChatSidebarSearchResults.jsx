import { RiChat3Line, RiUserAddLine } from "@remixicon/react";
import Loader from "../../../../components/Loader";
import IconsWrapper from "../../../../utils/IconsWrapper";
import Tooltip from "../../../../components/Tooltip";

const ChatSidebarSearchResults = ({ results, isLoading }) => {
  return (
    <div className="mt-8 mb-4">
      {isLoading && (
        <div className="h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="flex flex-col gap-2">
        {results?.map((user) => {
          return (
            <div
              className="p-4 flex gap-3 cursor-pointer hover:bg-(--bg-secondary) transition-colors duration-200 rounded-lg relative border-b border-(--foreground-primary)/20"
              key={user._id}
            >
              <img
                src={user.profilePicture}
                className="rounded-full w-11 h-11 object-cover border-2 border-transparent hover:border-(--accent-color-primary) transition duration-600"
                alt="Profile picture"
              />
              <div className="flex flex-col">
                <h3>{user.username}</h3>
                <p className="text-sm opacity-40">
                  {user.bio ? user.bio : "No bio available"}
                </p>
              </div>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <Tooltip content="start chat" delay={[600, 0]}>
                  <button className="rounded-full p-2.5">
                    <IconsWrapper icon={RiChat3Line} size={18} />
                  </button>
                </Tooltip>

                <Tooltip content="Add friend" delay={[600, 0]}>
                  <button className="rounded-full p-2.5">
                    <IconsWrapper icon={RiUserAddLine} size={18} />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatSidebarSearchResults;
