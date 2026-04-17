import { useState } from "react";
import ChatSidebarHeader from "./ChatSidebarHeader";
import ChatSidebarSearchInput from "./ChatSidebarSearchInput";
import ChatSidebarSearchResults from "./ChatSidebarSearchResults";
import ChatSidebarFriendsList from "./ChatSidebarFriendsList";

const ChatSidebar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const isSearching = query.trim().length > 0;

  return (
    <div className="bg-(--bg-primary) border-r border-(--foreground-primary)/20 max-w-[calc(100%/3.5)] py-5 px-4 min-h-screen max-h-screen overflow-auto">
      <ChatSidebarHeader />

      <ChatSidebarSearchInput
        query={query}
        setQuery={setQuery}
        setResults={setResults}
        setIsLoading={setIsLoading}
        setSearchError={setSearchError}
      />

      {searchError && query.trim().length > 0 && (
        <div className="text-destructive text-sm p-4">{searchError}</div>
      )}

      {isSearching ? (
        !searchError && results?.length === 0 && query?.trim().length > 1 ? (
          <div className="text-muted-foreground text-sm p-4">
            No users found.
          </div>
        ) : (
          <ChatSidebarSearchResults results={results} isLoading={isLoading} />
        )
      ) : (
        <ChatSidebarFriendsList />
      )}
    </div>
  );
};

export default ChatSidebar;
