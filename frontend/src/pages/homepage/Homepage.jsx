import { Link } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";
import Loader from "../../components/Loader";

const Homepage = () => {
  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[rgb(var(--accent-color-primary))] to-[rgb(var(--accent-color-secondary))] bg-clip-text text-transparent">
          Vedero Dashboard
        </h1>

        <div className="grid gap-4 text-center">
          <Link
            to="/chat"
            className={`p-6 rounded-xl text-2xl font-semibold transition-all ${
              isAuthenticated
                ? "bg-[rgb(var(--accent-color-primary))] text-white shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
          >
            💬 Chat
          </Link>

          <Link
            to="/login"
            className="p-6 bg-[rgb(var(--accent-color-secondary))] text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            🔐 Login
          </Link>
        </div>

        <div className="text-center text-sm opacity-75">
          Auth: {isAuthenticated ? "✅ Logged In" : "❌ Guest"}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
