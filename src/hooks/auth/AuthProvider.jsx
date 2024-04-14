import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PropTypes } from "prop-types";

import { AuthContext } from "./AuthContext";


const AuthProvider = ({ children }) => {
  const [token, setToken] = useLocalStorage("token", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = useCallback(async (data) => {
    setToken(data);
    navigate("/rooms-availabilities");
  }, [setToken, navigate]);

  // call this function to sign out logged in user
  const logout = useCallback(() => {
    setToken(null);
    navigate("/", { replace: true });
  }, [setToken, navigate]);

  if (token !== null) {
    const now = new Date();
    const expireDate = new Date(token.expire);
    if (expireDate.getTime() < now.getTime()) {
      setToken(null);
    }
  }
  const value = useMemo(
    () => ({
      token, login, logout
    }),
    [token, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  AuthProvider,
}