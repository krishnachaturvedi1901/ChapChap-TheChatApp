import axios from "axios";
import { createCookie, getCookies } from "../utils/cookies";
import { config } from "../config/config";
import { TOKEN_ENUMS } from "../enums/enums";

export async function loginUserReq(loginData) {
  console.log("loginReqFunc");
  try {
    const response = await axios.post(
      `${config.api_url}/auth/login`,
      loginData
    );
    console.log("res from login api", response);
    if (response.data.token) {
      localStorage.setItem(
        TOKEN_ENUMS.ACCESSTOKEN,
        JSON.stringify(response.data.token)
      );
      return {
        isLogin: true,
        message: response?.data?.message,
        data: response?.data,
      };
    }
  } catch (error) {
    console.log("error-login->", error);
    if (error.response && error.response.data && error.response.data.error) {
      const errMessage = error.response.data.error;
      if (typeof errMessage === "string") {
        throw new Error(error.response.data.error);
      } else if (Array.isArray(errMessage)) {
        const formattedErrorMessage = errMessage
          .map((msg) => (typeof msg === "string" ? msg : JSON.stringify(msg)))
          .join(", ");
        console.log("formatted error message-->", formattedErrorMessage);
        throw new Error(formattedErrorMessage);
      } else {
        throw new Error("Error: Unable to login user");
      }
    } else {
      throw new Error("Error: Network error occured");
    }
  }
}
