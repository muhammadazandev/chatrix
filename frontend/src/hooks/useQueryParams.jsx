import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (
    updates = {},
    isRemoveConId = false,
    clearAll = false,
  ) => {
    const params = clearAll
      ? new URLSearchParams()
      : new URLSearchParams(searchParams);

    if (!clearAll) {
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      if (isRemoveConId) {
        params.delete("conversationId");
      }
    }

    setSearchParams(params, { replace: true });
  };

  return {
    searchParams,
    updateParams,
  };
};
