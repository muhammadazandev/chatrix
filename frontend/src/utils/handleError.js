const handleError = (error) => {
  if (!error.response) return "Network error";

  const status = error.response.status;

  if (
    error.response.data.message === "No token, access denied" ||
    error.response.data.message === "No refresh token"
  )
    return;
  if (status === 429) return "Too many requests";
  if (status >= 500) return "Server error";

  return error.response.data?.message || "Something went wrong";
};

export default handleError;
