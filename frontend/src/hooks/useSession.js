import React, { useContext, createContext, useState } from "react";

const sessionContext = createContext();

export const ProvideSession = ({ children }) => {
  const session = useProvideSession();
  return (
    <sessionContext.Provider value={session}>
      {children}
    </sessionContext.Provider>
  );
};

export const useSession = () => useContext(sessionContext);

const useProvideSession = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const saveToken = (token) => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token");
    setToken(token);
  };

  return {
    token,
    setToken: saveToken,
  };
};
