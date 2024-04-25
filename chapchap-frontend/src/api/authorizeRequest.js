import axiosConfig from "../config/axios.config";

export const getAuthSession = async () => {
  try {
    const res = await axiosConfig("/auth/getAuthSession");
    console.log("res after getting session-", res);
    return res?.data;
  } catch (error) {
    console.log("error after getting sesson-", error?.response?.data?.error);
    throw new Error(error?.response?.data?.error);
  }
};
