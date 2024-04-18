import axios from "../config/axios.config";
import { TOKEN_ENUMS } from "../enums/enums";
import { createCookie } from "../utils/cookies";

const useRefreshToken = () => {
  const refresh = async () => {
    try {
      const response = await axios("/auth/renewToken");
      console.log("response after /renewToken-", response);
      if (response?.data?.token) {
        setAuth((prevAuth) => {
          return { ...prevAuth, accessToken: response.data.token };
        });
        return response.data.token;
      }
      return "";
    } catch (error) {
      console.log("error after /renewToken-", error);
      return new Error(error?.response?.data?.error);
    }
  };
  return refresh;
};
export default useRefreshToken;
