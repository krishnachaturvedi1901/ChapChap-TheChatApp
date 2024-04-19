import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCookies } from "../../utils/cookies";
import { TOKEN_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSnackbar } from "notistack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import axios from "../../config/axios.config";
import useAuth from "../../hooks/useAuth";

export const AuthGuard = ({ children }) => {
  const { auth, setAuth } = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { requestStatus } = useSelector((state) => state.loginState);
  const [isAllowedByOauth, setIsAllowedByOauth] = useState("");
  const refresh = useRefreshToken();
  const accessToken = JSON.parse(localStorage.getItem(TOKEN_ENUMS.ACCESSTOKEN));
  console.log("accessToekn in gueard-", accessToken);
  const { isTokenValid } = jwtDataDecoder(accessToken);

  // const renewAccessToken = async () => {
  //   try {
  //     const res = await refresh();
  //     console.log("res after refresh in guard-", res);
  //   } catch (error) {
  //     setSnackbarOpen(true);
  //     console.log(":error after refresh in guard-", error);
  //   }
  // };

  const getSession = async () => {
    try {
      const res = await axios("/auth/getSession");
      console.log("res after getting session-", res);
      return res?.data;
    } catch (error) {
      console.log("error after getting sesson-", error?.response?.data);
      throw new Error(error?.response?.data?.error);
    }
  };
  const isAuthenticated = async () => {
    try {
      const data = await getSession();
      console.log("res inAnth", data);
      setAuth(data);
      if (data?.isAuthorize) {
        setIsAllowedByOauth("isAllowed");
      } else {
        setIsAllowedByOauth("notAllowed");
      }
    } catch (error) {
      console.log("error in isAuthenticated", error);
    }
  };

  useLayoutEffect(() => {
    isAuthenticated();
  }, []);

  if (auth?.isAuthorize || isAllowedByOauth === "isAllowed" || isTokenValid) {
    return children;
  }
  return <Navigate to={"/"} />;
};
