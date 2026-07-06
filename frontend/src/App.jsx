import { useEffect } from "react";
import Layout from "./Layout";
import { registerListeners } from "./socket/listeners/register";
import { socket } from "./socket/socket";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    registerListeners();
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    console.log("Auth effect", isAuthenticated, socket.connected);

    if (isAuthenticated) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      socket.disconnect();
    }
  }, [isAuthenticated]);

  return <Layout />;
};

export default App;
