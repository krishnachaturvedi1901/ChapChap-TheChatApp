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
    failureRedirect: config.clientUrl_onLoginFailure,
  }),
  (req, res) => {
    res.redirect(config.clientUrl_onLoginSuccess);
  }
);
authRoute.get("/getSession", (req, res, next) => {
  console.log("req in /getSession-", req.session, "<--req-- from /getSession");
  console.log("req.session-in /getSession->", req.sessionStore?.sessions);

  if (req.sessionStore?.sessions) {
    console.log("keyyy-", Object.keys(req.sessionStore.sessions)[0]);
    const sessionDataStringify =
      req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)[0]];
    if (sessionDataStringify) {
      const sessionData = JSON.parse(sessionDataStringify);
      console.log("sessionData--/getSession--", sessionData);
      console.log("isPassport-", sessionData?.passport?.user);
      const user = sessionData?.passport?.user;
      if (user?._id) {
        return res.status(200).send({
          isAuthorize: true,
          user,
        });
      }
    }
  }
  return next(createHttpError.Unauthorized("Session expires login again"));
});

authRoute.delete("/logout", (req, res, next) => {
  console.log("req.logout called-", req, "<-req from /logout");
  console.log("req.session-", req.session);

  console.log("sessionId-", sessionId);
  req.logout((err) => {
    if (err) {
      console.log("err from logut", err);
      next(err);
    }
    res.status(200).send({ message: "Logout successfull" });
  });
  res.redirect(config.clientUrl_onLoginFailure);
});
