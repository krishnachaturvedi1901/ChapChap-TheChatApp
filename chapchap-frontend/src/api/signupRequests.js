import axios from "axios";
import { axiosSignupInstance } from "../config/axios.config";
import { config } from "../config/config";
import { SESSION_ENUMS } from "../enums/enums";
import { addToSessionStorage } from "../utils/editSessionStorage";

export async function addPersonalInfo(personalInfoData) {
  try {
    const response = await axios.post(
      `${config.api_url}/auth/signup/personalInfo`,
      personalInfoData
    );
    console.log("response-1->", response);
    if (response.data.token) {
      addToSessionStorage(SESSION_ENUMS.SIGNUPSESSIONKEY, response.data.token);
      return { isAdded: true, message: "Saved personal info successfully" };
    }
  } catch (error) {
    console.log("error-1->", error);
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
        throw new Error("Error: Unable to update personalInfo");
      }
    } else {
      throw new Error("Error: Network error occured");
    }
  }
}

export async function addCompanyInfo(companyInfoData) {
  try {
    const response = await axiosSignupInstance.post(
      "/auth/signup/companyInfo",
      companyInfoData
    );
    console.log("response-2->", response);
    if (response.data.token) {
      addToSessionStorage(SESSION_ENUMS.SIGNUPSESSIONKEY, response.data.token);
      return { isAdded: true, message: "Saved company info successfully" };
    }
  } catch (error) {
    console.log("error-2->", error);
    if (error.response && error.response.data && error.response.data.error) {
      const errMessage = error.response.data.error;
      if (typeof errMessage === "string") {
        throw new Error(error.response.data.error);
      } else if (Array.isArray(errMessage)) {
        throw new Error(errMessage.join("; "));
      } else {
        throw new Error("Error: Unable to update company info");
      }
    } else {
      throw new Error("Error: Network error occured");
    }
  }
}

export async function addEmailPasswordInfo(emailPassInfoData) {
  try {
    const response = await axiosSignupInstance.post(
      "/auth/signup/register",
      emailPassInfoData
    );
    console.log("response-3->", response);
    if (response.data.token) {
      addToSessionStorage(SESSION_ENUMS.SIGNUPSESSIONKEY, response.data.token);
      return { isAdded: true, message: "Added user successfully" };
    }
  } catch (error) {
    console.log("error-3->", error);
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
        throw new Error("Error: Unable to update email/password");
      }
    } else {
      throw new Error("Error: Network error occured");
    }
  }
}
