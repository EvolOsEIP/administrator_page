import { useEffect } from "react";
import checkToken from "../utils/testToken";

const RequireAuth = () => {
  useEffect(() => {
    if (!checkToken()) {
      window.location.href = "/login";
    }
  }, []);

  return null; // ne rend rien, juste vérifie
};

export default RequireAuth;