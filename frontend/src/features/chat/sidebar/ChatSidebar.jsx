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
import Motion from "../../../components/motion/Motion";
import {
  fade,
  slideFade,
  slideInLeft,
} from "../../../components/motion/variants";

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

        <AnimatePresence mode="wait">
          {isSearching ? (
            <Motion key="search" variants={fade}>
              {renderSearch()}
            </Motion>
          ) : currentView === "settings" ? (
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
    </FocusProvider>
  );
};

export default ChatSidebar;
