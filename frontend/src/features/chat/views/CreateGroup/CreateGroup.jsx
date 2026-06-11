import { useEffect, useState } from "react";
import { RiArrowRightLine, RiCloseFill } from "@remixicon/react";
import IconsWrapper from "../../../../utils/IconsWrapper";
import Motion from "../../../../motion/Motion";
import { popLift, slideInRight } from "../../../../motion/variants";
import useSlidePanelClose from "../../../../hooks/useSlidePanelClose";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import useFriendshipStore from "../../../../store/useFriendshipStore";
import { AnimatePresence } from "motion/react";
import GroupProfile from "./GroupProfile";

function Lists({ friend = {}, isSelected, moveElement }) {
  return (
    <div
      key={friend}
      className={`group p-2 relative border-(--foreground-secondary)/30 flex items-center ${isSelected ? "border-none cursor-default gap-2" : "border-btransition-all duration-200 rounded-lg hover:bg-(--bg-secondary)/50 cursor-pointer gap-4"}`}
      onClick={(e) => {
        if (isSelected) {
          if (e.target.tagName === "BUTTON")
            return moveElement(isSelected, friend._id);
        } else {
          moveElement(isSelected, friend._id);
        }
      }}
    >
      <img
        src={friend?.profilePicture}
        className={`rounded-full object-cover border border-(--foreground-secondary)/20 transition duration-300 ${isSelected ? "w-8 h-8" : "w-12 h-12 group-hover:border-(--foreground-primary)/40 "}`}
        alt={friend?.username}
      />

      <div className={`${isSelected ? "truncate max-w-[60%]" : ""}`}>
        <h3 className="text-sm font-semibold text-(--foreground-primary) tracking-wide">
          {friend?.username}
        </h3>

        {!isSelected && (
          <p className="text-xs font-medium opacity-50 truncate max-w-60 mt-0.5">
            {friend?.bio || ""}
          </p>
        )}
      </div>
      {isSelected && (
        <button className="p-0.5 rounded-full justify-self-end">
          <IconsWrapper icon={RiCloseFill} size={19} />
        </button>
      )}
    </div>
  );
}

const CreateGroup = () => {
  const friends = useFriendshipStore((state) => state.friends);
  const getAllFriends = useFriendshipStore((state) => state.getAllFriends);

  const { scope, close } = useSlidePanelClose();
  const { updateParams } = useQueryParams();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [value, setValue] = useState("");
  const [isGroupProfile, setIsGroupProfile] = useState(false);

  useEffect(() => {
    if (friends.length === 0) {
      getAllFriends();
    }
  }, [friends, getAllFriends]);

  const availableFriends = friends.filter(
    (fr) => !selectedFriends.some((f) => f._id === fr._id),
  );
  const filteredFriends =
    value.length > 0
      ? availableFriends.filter((a) =>
          a.username.toLowerCase().includes(value.toLowerCase()),
        )
      : [];

  function moveElement(isSelected, id) {
    if (!isSelected) {
      const element = friends.find((fr) => fr._id === id);
      if (!element) return;

      setSelectedFriends([...selectedFriends, element]);
    } else {
      setSelectedFriends(selectedFriends.filter((fr) => fr._id !== id));
    }
  }

  return (
    <Motion variants={slideInRight} ref={scope} className="h-full">
      <div className="flex flex-col gap-5 relative h-full">
        <header className="flex gap-4 items-center">
          <button
            type="button"
            className="rounded-full p-2"
            onClick={async () => {
              await close();
              updateParams({ view: null });
            }}
          >
            <IconsWrapper icon={RiCloseFill} />
          </button>
          <p>Add group members</p>
        </header>
        <div className="grid grid-cols-2 min-w-full max-h-40 overflow-y-auto">
          {selectedFriends.length > 0 &&
            selectedFriends.map((friend) => {
              return (
                <Lists
                  friend={friend}
                  key={friend._id}
                  isSelected={true}
                  moveElement={moveElement}
                />
              );
            })}
        </div>

        <div className="mx-2 mt-8">
          <input
            type="text"
            className="border-b text-sm pb-2 w-full border-(--foreground-primary)/50"
            placeholder="Search friend"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div
          className={`flex flex-col gap-4 mt-5 overflow-y-auto max-h-full ${selectedFriends.length > 0 ? "pb-24" : ""}`}
        >
          {value.length === 0 ? (
            availableFriends
              .slice()
              .sort((a, b) => a.username.localeCompare(b.username))
              .map((friend) => (
                <Lists
                  friend={friend}
                  key={friend._id}
                  isSelected={false}
                  moveElement={moveElement}
                />
              ))
          ) : filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <Lists
                friend={friend}
                key={friend._id}
                isSelected={false}
                moveElement={moveElement}
              />
            ))
          ) : (
            <p className="text-sm opacity-50">No friends found</p>
          )}
        </div>
        <AnimatePresence mode="wait">
          {selectedFriends.length > 0 && (
            <Motion
              variants={popLift}
              className="fixed bottom-0 py-8 bg-(--bg-primary) w-[calc(100%/3.5)] flex justify-center"
            >
              <button
                className="p-3 rounded-full bg-(--accent-color-primary)"
                onClick={() => setIsGroupProfile(true)}
              >
                <IconsWrapper icon={RiArrowRightLine} size={26} />
              </button>
            </Motion>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isGroupProfile && (
          <GroupProfile
            isGroupProfile={isGroupProfile}
            setIsGroupProfile={setIsGroupProfile}
          />
        )}
      </AnimatePresence>
    </Motion>
  );
};

export default CreateGroup;
