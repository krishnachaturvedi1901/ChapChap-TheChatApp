import axiosConfig from "../config/axios.config";

export const getSession = async () => {
  try {
    const res = await axiosConfig("/auth/getSession");
    console.log("res after getting session-", res);
    return res?.data;
  } catch (error) {
    console.log("error after getting sesson-", error?.response?.data);
    throw new Error(error?.response?.data?.error);
  }
};
