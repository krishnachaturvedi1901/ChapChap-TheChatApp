import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCookies } from "../../utils/cookies";
import { LOADING_ENUMS, TOKEN_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useSnackbar } from "notistack";
import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { getAuthSession } from "../../api/authorizeRequest";

export const AuthGuard = ({ children }) => {
  const { isLoading: authSessionLoading, auth } = useSelector(
    (state) => state.authSessionState
  );

  console.log("auth-inauthguard->", auth);
  if (auth?.isAuthorize) {
    console.log("authGurad returning children");
    return children;
  } else if (
    !auth?.isAuthorize &&
    authSessionLoading !== LOADING_ENUMS.LOAD_PENDING
  ) {
    console.log("from AuthGuard--->else if");
    return <Navigate to={"/"} />;
  }
};
