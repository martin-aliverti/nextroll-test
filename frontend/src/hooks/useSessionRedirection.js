import React, { createContext, useEffect } from "react";
import { useNavigate } from "@reach/router";
import { useSession } from "./useSession";

const redirectContext = createContext();

export const ProvideSessionRedirect = ({ children }) => {
  const redirector = useProvideRedirector();
  return (
    <redirectContext.Provider value={redirector}>
      {children}
    </redirectContext.Provider>
  );
};

const useProvideRedirector = () => {
  const { token } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(token ? "/" : "./login", { replace: true });
  }, [token, navigate]);
};
