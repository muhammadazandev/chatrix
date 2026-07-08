import { useEffect } from "react";
import Layout from "./Layout";
import { registerListeners } from "./socket/listeners/register";
import { socket } from "./socket/socket";
import useAuthStore from "./store/useAuthStore";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const authChecked = useAuthStore((state) => state.authChecked);

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
    if (!authChecked) return;

    if (isAuthenticated) {
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      socket.disconnect();
    }
  }, [authChecked, isAuthenticated]);

  return <Layout />;
};

export default App;
