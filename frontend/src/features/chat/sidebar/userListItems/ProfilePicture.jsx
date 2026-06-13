import { useQueryParams } from "../../../../hooks/useQueryParams";
import useFriendshipStore from "../../../../store/useFriendshipStore";

const ProfilePicture = ({ user }) => {
  const { updateParams } = useQueryParams();
  const updateOpenedUserProfile = useFriendshipStore(
    (state) => state.updateOpenedUserProfile,
  );

  return (
    <>
      <img
        src={user?.profilePicture}
        alt={`${user?.username} profile`}
        className="rounded-full w-12 h-12 object-cover border border-(--foreground-secondary)/20 group-hover:border-(--foreground-primary)/40 transition duration-300 cursor-pointer"
        onClick={() => {
          updateOpenedUserProfile(user || null);

          updateParams(
            {
              view: "profile",
              userId: user._id,
            },
            true,
          );
        }}
      />
    </>
  );
};

export default ProfilePicture;
