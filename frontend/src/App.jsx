import { useEffect } from "react";
import Layout from "./Layout";
import { socket } from "./socket/socket";

const App = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected: ", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return <Layout />;
};

export default App;
