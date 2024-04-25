import axiosConfig from "../config/axios.config";

export async function logoutRequest() {
  try {
    const response = await axiosConfig.delete("/auth/logout");
    console.log("res=after logout", response);
    return response?.data?.message;
  } catch (error) {
    console.log("err after logout-", error?.response?.data?.error);
    throw new Error(error?.response?.data?.error);
  }
}
