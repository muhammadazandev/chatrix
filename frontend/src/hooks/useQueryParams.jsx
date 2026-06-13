import { useSearchParams } from "react-router-dom";

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = (updates, isRemoveConId) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      if (isRemoveConId) params.delete("conversationId");
    });

    setSearchParams(params);
  };

  return {
    searchParams,
    updateParams,
  };
};
