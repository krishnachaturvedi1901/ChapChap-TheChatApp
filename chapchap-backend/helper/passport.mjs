import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserModel } from "../models/UsersModel.mjs";
import passport from "passport";
import { config } from "../config/config.mjs";
import { OAuthUserModel } from "../models/OauthUserModel.mjs";

const googleAuthStrategy = new GoogleStrategy(
  {
    clientID: config.google_oauth_clientId,
    clientSecret: config.google_oauth_client_secret,
    callbackURL: "http://localhost:8080/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(
      "inGoogleFUnc-",
      profile,
      "accessToken from goog",
      accessToken,
      "refToken from goog",
      refreshToken
    );
    try {
      let userAlready = await UserModel.findOne({
        email: profile?.emails[0].value,
      });
      let userInOauth = await OAuthUserModel.findOne({
        provider: "google",
        userOauthId: profile?.id,
      });
      if (userAlready && !userInOauth) {
        userInOauth = await OAuthUserModel.create({
          provider: "google",
          userOauthId: profile.id,
          userId: userAlready._id,
          userEmail: profile?.emails[0].value,
        });
        return cb(false, userAlready);
      } else if (!userAlready && !userInOauth) {
        userAlready = await UserModel.create({
          name: profile?.displayName,
          email: profile?.emails[0].value,
        });
        userInOauth = await OAuthUserModel.create({
          provider: "google",
          userOauthId: profile?.id,
          userId: userAlready?._id,
          userEmail: profile?.emails[0].value,
        });
        return cb(false, userAlready);
      } else if (!userAlready && userInOauth) {
        userAlready = await UserModel.create({
          name: profile?.displayName,
          email: profile?.emails[0].value,
        });
        return cb(false, userAlready);
      }
      return cb(false, userAlready);
    } catch (error) {
      console.log("Error from passport.js file-", error);
      return cb(error);
    }
  }
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default googleAuthStrategy;
