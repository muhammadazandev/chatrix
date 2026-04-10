import { Link } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../../store/useAuthStore";

const Homepage = () => {
  /*
  useEffect(() => {
    async function wow() {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username: "azan_sabir",
          email: "gamingvill2.0@gmail.com",
          password: "mera password to yahi hay bhai",
        },
        {
          withCredentials: true,
        },
      );

      console.log(res);
    }
    wow();
  }, []);
  */

  const { isLoading, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--accent-color-primary))] mb-4" />
          <p className="text-[rgb(var(--foreground))] text-lg font-medium">
            Checking authentication...
          </p>
        </div>
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
