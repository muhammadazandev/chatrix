import { useEffect } from "react";
import Layout from "./Layout";
import { initSocketListeners } from "./socket/listeners/initSocketListeners";
import { socket } from "./socket/socket";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    initSocketListeners();
    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
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
