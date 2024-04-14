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
authRoute.delete("/logout", logoutHandler);
authRoute.get("/renewToken", authorizeRefreshToken, renewTokenHandler);

authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/login",
  })
  // function (req, res) {
  //   // Successful authentication, redirect dashboard.
  //   console.log("after success login in google-", req?.user);
  //   res.redirect("/dashboard");
  // }
);

authRoute.get("/protected", (req, res) => {
  console.log("In protected route-", req.user);
  res.send(200);
});
