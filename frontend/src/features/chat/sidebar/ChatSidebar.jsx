import { useEffect, useState } from "react";
import Header from "./header/Header";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";
import ViewTabs from "../views/ViewTabs";
import { motion, AnimatePresence } from "motion/react";
import { FocusProvider } from "../../../Context/InputFocusContext";
import { NoUserFound } from "./components/EmptyStates";
import SidebarViewRenderer from "../views/SidebarViewRenderer";
import { useSearchParams } from "react-router-dom";

const ChatSidebar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchParams] = useSearchParams();

  const currentView = searchParams.get("view") || "friends";

  const isSettingsView = currentView === "settings";

  const isSearching = !isSettingsView && query.trim().length > 1;

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

  useEffect(() => {
    if (isSettingsView) {
      setQuery("");
      setResults([]);
      setSearchError("");
    }
  }, [isSettingsView]);

  return (
    <FocusProvider>
      <div className="bg-(--bg-primary) border-r border-(--foreground-primary)/20 max-w-[calc(100%/3.5)] py-5 px-4 min-h-screen relative">
        <AnimatePresence mode="wait">
          {!isSettingsView && (
            <motion.div
              key="sidebar-chrome"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
            >
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
                  <motion.div
                    key="view-tabs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "anticipate" }}
                  >
                    <ViewTabs currentView={currentView} />
                  </motion.div>
                )}
              </AnimatePresence>
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
              transition={{ duration: 0.5, ease: "anticipate" }}
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
              <SidebarViewRenderer currentView={currentView} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FocusProvider>
  );
};

export default ChatSidebar;
