import { useSession } from "../hooks/useSession";

const server_url = process.env.REACT_APP_API_URL;

export default () => {
  const { setToken, token } = useSession();

  return {
    get: async (endpoint, authenticate = true) => {
      const headers = {
        "Content-Type": "application/json",
      };
      if (authenticate) {
        headers.Authorization = `Bearer ${token}`;
      }
      const options = { method: "get", headers };
      const response = await fetch(`${server_url}/${endpoint}`, options);
      if (response.status === 401) setToken(null);
      if (response.status !== 200) {
        // post error for components to see
        return;
      }
      return response.json();
    },

    post: async (endpoint, body, authenticate = true) => {
      const headers = {
        "Content-Type": "application/json",
      };
      if (authenticate) {
        headers.Authorization = `Bearer ${token}`;
      }
      const options = { method: "post", headers, body: JSON.stringify(body) };
      const response = await fetch(`${server_url}/${endpoint}`, options);
      if (response.status === 401) setToken(null);
      if (![200, 201].includes(response.status)) {
        // post error for components to see
        return;
      }
      return response.json();
    },

    remove: async (endpoint, authenticate = true) => {
      const headers = {
        "Content-Type": "application/json",
      };
      if (authenticate) {
        headers.Authorization = `Bearer ${token}`;
      }
      const options = { method: "delete", headers };
      const response = await fetch(`${server_url}/${endpoint}`, options);
      if (response.status === 401) setToken(null);
      if (![200, 204].includes(response.status)) {
        // post error for components to see
        return;
      }
      return null;
    },
  };
};
