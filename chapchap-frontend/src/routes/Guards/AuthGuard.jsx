import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCookies } from "../../utils/cookies";
import { TOKEN_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import axios from "../../config/axios.config";

export const AuthGuard = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { requestStatus } = useSelector((state) => state.loginState);
  const refresh = useRefreshToken();
  const accessToken = JSON.parse(localStorage.getItem(TOKEN_ENUMS.ACCESSTOKEN));
  console.log("accessToekn in gueard-", accessToken);

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
      return res.data;
    } catch (error) {
      console.log("error after getting sesson-", error?.response?.data);
      throw new Error(error?.response?.data?.error);
    }
  };
  const isAuthenticated = async () => {
    try {
      const isAuthenticated = await getSession();
      console.log("isAuthenticated", isAuthenticated);
      return isAuthenticated;
    } catch (error) {
      console.log("error in isAuthenticated", error);
      return false;
    }
  };

  const redirectToDashboard = async () => {
    if (await isAuthenticated()) {
      return children;
    } else {
      return <Navigate to={"/"} />;
    }
  };
  useEffect(() => {
    redirectToDashboard();
  }, []);

  if (accessToken) {
    const { isTokenValid } = jwtDataDecoder(accessToken);
    if (isTokenValid) {
      return children;
    } else {
      console.log("InElse");
      return (
        <>
          <Snackbar open={true} autoHideDuration={5000}>
            <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
              {"Unauthorized: Invalid token"}
            </Alert>
          </Snackbar>
          <Navigate to={"/"} />
        </>
      );
    }
  } else {
    return <Navigate to={"/"} />;
  }
};
