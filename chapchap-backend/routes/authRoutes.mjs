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
import {
  verifyAccessToken,
  verifyRefreshToken,
} from "../middlewares/verifyTokens.mjs";
import passport from "passport";
import { config } from "../config/config.mjs";
import { verifyOauthSession } from "../middlewares/verifyOauthSession.mjs";

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
authRoute.get("/renewToken", verifyRefreshToken, renewTokenHandler);

authRoute.get("/google", passport.authenticate("google"));

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: config.clientUrl_onLoginFailure,
  }),
  (req, res) => {
    res.redirect(config.clientUrl_onLoginFailure);
  }
);

authRoute.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "profileUrl"],
  })
);

authRoute.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: config.clientUrl_onLoginFailure,
  }),
  (req, res) => {
    res.redirect(config.clientUrl_onLoginSuccess);
  }
);

authRoute.get("/getAuthSession", verifyAccessToken, verifyOauthSession);

authRoute.delete("/logout", logoutHandler);
