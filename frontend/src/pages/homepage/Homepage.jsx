import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const Homepage = () => {
  /*
  useEffect(() => {
    async function wow() {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          username: "azan_sabir",
          email: "gamingvill2.0@gmail.com",
          password: "03103852656xyz",
        },
        {
          withCredentials: true,
        },
      );

      console.log(res);
    }
    wow();
  }, []);
  
  useEffect(() => {
    async function wow() {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        console.log("Success data:", res.data); // real backend data
      } catch (error) {
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Data from server:", error.response.data);
        } else if (error.request) {
          console.log("Request made but no response:", error.request);
        } else {
          console.log("Error config / message:", error.message);
        }
      }
    }
    wow();
  }, []);
  */

  useEffect(() => {
    async function wow() {
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/forgot-password",
          {
            email: "gamingvill2.0@gmail.com", // Replace with actual email
            withCredentials: true,
          },
        );
        console.log("Success data:", res.data); // real backend data
      } catch (error) {
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Data from server:", error.response.data);
        } else if (error.request) {
          console.log("Request made but no response:", error.request);
        } else {
          console.log("Error config / message:", error.message);
        }
      }
    }
    wow();
  }, []);

  return (
    <div>
      <Link to="/chat">Chat</Link>
      <br />
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Homepage;
