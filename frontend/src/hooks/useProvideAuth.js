import React, { useState, useContext, createContext } from "react";
import AuthService from "../services/AuthService";
import { useSession } from "./useSession";

const authContext = createContext();

export const ProvideAuth = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => useContext(authContext);

const useProvideAuth = () => {
  const { setToken } = useSession();
  const [loading, setLoading] = useState(false);
  const { login, register } = AuthService();

  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const token = await login(credentials);
      setToken(token);
      localStorage.setItem("token", token);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials) => {
    setLoading(true);
    try {
      await register(credentials);
      const token = await login(credentials);
      localStorage.setItem("token", token);
      setToken(token);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.clear();
    setToken(null);
  };

  return {
    loading,
    signIn,
    signUp,
    signOut,
  };
};
