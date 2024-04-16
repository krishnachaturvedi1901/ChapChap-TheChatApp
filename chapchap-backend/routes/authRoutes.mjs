import express from "express";
import {
  loginHandler,
  logoutHandler,
  registerCompanyInfo,
  registerEmailPassword,
  registerPersonalInfo,
  renewTokenHandler,
} from "../controllers/authHandler.mjs";
import { authorize } from "../middlewares/auth.mjs";
import { schemaValidator } from "../middlewares/schemaValidator.mjs";
import { authorizeRefreshToken } from "../middlewares/verifyRefreshToken.mjs";
import passport from "passport";
import createHttpError from "http-errors";
import { config } from "../config/config.mjs";

export const authRoute = express.Router();

authRoute.post(
  "/signup/personalInfo",
  schemaValidator("/auth/signup/personalInfo"),
  registerPersonalInfo
);
authRoute.post(
  "/signup/companyInfo",
  authorize,
  schemaValidator("/auth/signup/companyInfo"),
  registerCompanyInfo
);
authRoute.post(
  "/signup/register",
  authorize,
  schemaValidator("/auth/signup/register"),
  registerEmailPassword
);
authRoute.post("/login", loginHandler);
authRoute.get("/renewToken", authorizeRefreshToken, renewTokenHandler);

authRoute.get("/google", passport.authenticate("google"));

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    // successRedirect: config.clientUrl_onLoginSuccess,
    failureRedirect: config.clientUrl_onLoginFailure,
  }),
  (req, res) => {
    req.session.isAuthenticatedByOauth = true;
    console.log("req.session-in /google/callback->", req.session);
    res.redirect(config.clientUrl_onLoginSuccess);
  }
);
authRoute.get("/getSession", (req, res, next) => {
  console.log("req.session-in /getSession->", req.sessionStore?.sessions);

  if (req.sessionStore?.sessions) {
    console.log("keyyy-", Object.keys(req.sessionStore.sessions)[0]);
    const sessionData =
      req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)[0]];
    console.log("sessionData--/getSession--", sessionData);
    const isAuthenticatedByOauth = sessionData["isAuthenticatedByOauth"];
    console.log("isAuthKEy-", isAuthenticatedByOauth);
    return res.status(200).send({
      isAuthenticatedByOauth,
    });
  }

  return next(createHttpError.Unauthorized("Session expires"));
});
authRoute.get("/logout", (req, res) => {
  req.logout();
  res.redirect(config.clientUrl_onLoginFailure);
});
