import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ForgotPassword = () => {
  const { token } = useParams();

  useEffect(() => {
    async function wow() {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/auth/reset-password/${token}`,
          {
            password: "mera password to yahi hay bhai",
            withCredentials: true,
          },
        );
        console.log("Success data:", res.data);
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

  return <div></div>;
};

export default ForgotPassword;
