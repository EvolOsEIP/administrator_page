import { useEffect } from "react";
import checkToken from "../utils/testToken";
import checkLogin from "../utils/CheckLogin";

const RequireAuth = () => {
  useEffect(() => {
    checkLogin(undefined, () => {
        window.location.href = "/login";
        localStorage.removeItem("token"); // Clear invalid token
    });
  }, []);

  return null; // ne rend rien, juste vérifie
};

export default RequireAuth;