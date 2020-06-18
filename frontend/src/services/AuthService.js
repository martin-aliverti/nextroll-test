import Api from "../utils/Api";

const AUTH_ENDPOINT = "auth";

export default () => {
  const { post } = Api();
  return {
    login: async (credentials) =>
      (await post(`${AUTH_ENDPOINT}/login`, credentials, false)).access_token,

    register: (credentials) =>
      post(`${AUTH_ENDPOINT}/register`, credentials, false),
  };
};
