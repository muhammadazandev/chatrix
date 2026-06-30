import { useEffect, useState } from "react";
import Header from "./header/Header";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";
import ViewTabs from "../views/ViewTabs";
import { AnimatePresence } from "motion/react";
import { FocusProvider } from "../../../Context/InputFocusContext";
import { NoUserFound } from "./components/EmptyStates";
import SidebarViewRenderer from "../views/SidebarViewRenderer";
import { useSearchParams } from "react-router-dom";
import useFriendshipStore from "../../../store/useFriendshipStore";
import Motion from "../../../motion/Motion";
import { fade, slideFade, slideInLeft } from "../../../motion/variants";

const ChatSidebar = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchParams] = useSearchParams();
  const results = useFriendshipStore((state) => state.searchResults);
  const setResults = useFriendshipStore((state) => state.setSearchResults);

  const currentView = searchParams.get("view") || "conversation";

  const isDifferentView =
    currentView === "settings" ||
    currentView === "profile" ||
    currentView === "create-group" ||
    currentView === "conversation-info";

  const isSearching = !isDifferentView && query.trim().length > 1;

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
    if (isDifferentView) {
      setQuery("");
      setResults(null);
      setSearchError("");
    }
  }, [isDifferentView]);

  return (
    <FocusProvider>
      <div className="bg-(--bg-primary) border-r border-(--foreground-primary)/20 max-w-[calc(100%/3.5)] min-w-[calc(100%/3.5)] min-h-screen max-h-screen relative flex flex-col">
        <div className={`shrink-0 px-4 pt-6`}>
          <AnimatePresence mode="wait">
            {!isDifferentView && (
              <Motion key="sidebar-chrome" variants={slideFade}>
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
                    <Motion key="view-tabs" variants={fade}>
                      <ViewTabs currentView={currentView} />
                    </Motion>
                  )}
                </AnimatePresence>
              </Motion>
            )}
          </AnimatePresence>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pb-5">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <Motion key="search" variants={fade}>
                {renderSearch()}
              </Motion>
            ) : currentView === "settings" || currentView === "profile" ? (
              <Motion key="settings" variants={slideInLeft}>
                <SidebarViewRenderer currentView={currentView} />
              </Motion>
            ) : (
              <Motion key={currentView} variants={fade}>
                <SidebarViewRenderer currentView={currentView} />
              </Motion>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FocusProvider>
  );
};

export default ChatSidebar;
