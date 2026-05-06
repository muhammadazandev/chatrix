import Loader from "../../../../../components/Loader";
import UserListItem from "../UserListItem";
import RenderActionButtons from "../RelationshipActionMenu";

const SearchResults = ({ results, isLoading }) => {
  function RenderActions(user) {
    return <RenderActionButtons user={user} status="none" />;
  }

  return (
    <div className="mt-8 mb-4">
      {isLoading ? (
        <div className="h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <UserListItem users={results} RenderActions={RenderActions} />
      )}
    </div>
  );
};

export default SearchResults;
