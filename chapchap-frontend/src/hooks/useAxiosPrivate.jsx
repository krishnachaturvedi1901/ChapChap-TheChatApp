import { useEffect } from "react";
import { axiosPrivate } from "../config/axios.config";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevReq = error?.config;
        if (error?.response?.data?.status === 401 && !prevReq?.sent) {
          prevReq.sent = true;
          try {
            const newAccessToken = await refresh();
            if (newAccessToken) {
              prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axiosPrivate(prevReq);
            }
          } catch (error) {
            console.log(error);
            return error;
          }
        }
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [auth, refresh]);
};
export default useAxiosPrivate;
