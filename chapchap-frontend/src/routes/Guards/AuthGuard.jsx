import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCookies } from "../../utils/cookies";
import { TOKEN_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSnackbar } from "notistack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { getSession } from "../../api/authorizeRequest";

export const AuthGuard = ({ children }) => {
  const { auth, setAuth } = useAuth();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { requestStatus } = useSelector((state) => state.loginState);
  const refresh = useRefreshToken();
  const accessToken = JSON.parse(localStorage.getItem(TOKEN_ENUMS.ACCESSTOKEN));
  const [accTokenData, setAccTokenData] = useState({
    isTokenValid: false,
    user: {},
  });
  console.log("accessToekn in gueard-", accessToken);
  console.log("accTokenData--", accTokenData);
  // const renewAccessToken = async () => {
  //   try {
  //     const res = await refresh();
  //     console.log("res after refresh in guard-", res);
  //   } catch (error) {
  //     setSnackbarOpen(true);
  //     console.log(":error after refresh in guard-", error);
  //   }
  // };

  const isAuthorizedByOauth = async () => {
    try {
      const data = await getSession();
      console.log("res inAnth", data);
      setAuth({ ...auth, ...data });
    } catch (error) {
      console.log("error in isAuthenticated", error);
      setAuth({ ...auth, isAuthorize: false, user: {} });
    }
  };

  useLayoutEffect(() => {
    if (accessToken) {
      const accessTokenData = jwtDataDecoder(accessToken);
      setAccTokenData(accessTokenData);
    }
  }, [accessToken]);

  useLayoutEffect(() => {
    if (!auth.isAuthorize) {
      isAuthorizedByOauth();
    }
  }, []);

  console.log("auth-->", auth);
  if (auth?.isAuthorize || accTokenData.isTokenValid) {
    return children;
  } else if (!auth?.isAuthorize) {
    return <Navigate to={"/"} />;
  }
};
