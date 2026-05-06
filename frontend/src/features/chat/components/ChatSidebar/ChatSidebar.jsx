import { useState } from "react";
import Header from "./Header";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";
import FriendsList from "./SidebarNav/FriendsList";
import Views from "./SidebarNav/Views";
import { motion, AnimatePresence } from "motion/react";
import FriendRequests from "./SidebarNav/FriendRequests";
import Blocked from "./SidebarNav/Blocked";
import { FocusProvider } from "../../../../Context/InputFocusContext";
import { NoUserFound } from "./EmptyStates";

const ChatSidebar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [currentView, setCurrentView] = useState("friends");

  const isSearching = query.trim().length > 0;

  function renderView() {
    switch (currentView) {
      case "friends":
        return <FriendsList setCurrentView={setCurrentView} />;

      case "requests":
        return <FriendRequests />;
      case "blocked":
        return <Blocked />;

      default:
        return <div>Select a view</div>;
    }
  }

  function renderSearch() {
    if (
      !searchError &&
      !isLoading &&
      results.length === 0 &&
      query.trim().length > 1
    ) {
      return <NoUserFound />;
    }

    return <SearchResults results={results} isLoading={isLoading} />;
  }

  return (
    <FocusProvider>
      <div className="bg-(--bg-primary) border-r border-(--foreground-primary)/20 max-w-[calc(100%/3.5)] py-5 px-4 min-h-screen">
        <Header />

        <SearchInput
          query={query}
          setQuery={setQuery}
          setResults={setResults}
          setIsLoading={setIsLoading}
          setSearchError={setSearchError}
        />

        <AnimatePresence mode="wait">
          {!isSearching && (
            <Views
              currentView={currentView}
              setCurrentView={setCurrentView}
              key="Views"
            />
          )}

          {searchError && isSearching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-destructive text-sm p-4"
              transition={{ duration: 0.2 }}
            >
              {searchError}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4"
            >
              {renderSearch()}
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
              className="mt-4"
            >
              {renderView()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FocusProvider>
  );
};

export default ChatSidebar;
