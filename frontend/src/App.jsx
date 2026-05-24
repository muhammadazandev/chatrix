import { useEffect } from "react";
import Layout from "./Layout";
import { initSocketListeners } from "./socket/listeners/initSocketListeners";

const App = () => {
  useEffect(() => {
    initSocketListeners();
  }, []);

  return <Layout />;
};

export default App;
