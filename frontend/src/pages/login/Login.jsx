import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import Form from "./Form";
import { useEffect, useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="rounded-sm border border-(--foreground-primary)/30 p-8">
        <h3 className="text-3xl">Log in</h3>

        <Form
          isLoading={isLoading}
          onSubmit={login}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
        />

        <p className="opacity-50 mt-8">
          Don't have an account?
          <Link to="/signup" className="ml-2 text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
