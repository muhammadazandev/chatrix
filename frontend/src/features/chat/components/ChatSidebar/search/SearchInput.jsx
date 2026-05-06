import { RiSearch2Line } from "@remixicon/react";
import IconsWrapper from "../../../../../utils/IconsWrapper";
import { authApi } from "../../../../../utils/api";
import { useEffect } from "react";
import { useFocusInput } from "../../../../../Context/InputFocusContext";

const SearchInput = ({
  query,
  setQuery,
  setResults,
  setIsLoading,
  setSearchError,
}) => {
  const inputRef = useFocusInput();
  
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const trimmedQuery = query.trim();

      if (trimmedQuery.length === 0) {
        setResults([]);
        setSearchError("");
        setIsLoading(false);
        return;
      }

      if (trimmedQuery.length < 2) {
        setResults([]);
        setSearchError("Please enter at least 2 characters.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setSearchError("");

      try {
        const response = await authApi.get(
          `/user/search?q=${encodeURIComponent(trimmedQuery)}`,
        );

        setResults(response.data.users || []);
      } catch (error) {
        console.error(error);
        setSearchError(
          error.response?.data?.message ||
            "Unable to fetch search results. Please try again.",
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, setResults, setIsLoading, setSearchError]);

  return (
    <div className="mt-4">
      <div className="rounded-full px-4 py-3   bg-(--bg-secondary) flex justify-between gap-3 items-center focus-within:bg-transparent transition-colors duration-400 ring-transparent ring-1 focus-within:ring-(--accent-color-primary) border-0 no-focus">
        <IconsWrapper icon={RiSearch2Line} size={19} />
        <input
          ref={inputRef}
          type="text"
          className="flex-1"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
