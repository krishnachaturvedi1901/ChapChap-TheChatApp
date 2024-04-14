import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/UsersModel.mjs";
import passport from "passport";
import { config } from "../config/config.mjs";

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID: config.google_oauth_clientId,
    clientSecret: config.google_oauth_client_secret,
    callbackURL: "http://localhost:8080/auth/google/callback",
    scope: ["profile", "email"],
  },
  (accessToken, refreshToken, profile, cb) => {
    UserModel.findOrCreate({ googleId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default googleAuthStrategy;
