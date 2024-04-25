import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { UserModel } from "../models/UsersModel.mjs";
import { OAuthUserModel } from "../models/OauthUserModel.mjs";
import { config } from "../config/config.mjs";

const facebookAuthStrategy = new FacebookStrategy(
  {
    clientID: config.facebook_oauth_appId,
    clientSecret: config.facebook_oauth_secret,
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(
      "inFacebookOuth-",
      profile,
      "accessToken from fb",
      accessToken,
      "refToken from fb",
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
      userAlready = { ...userAlready, accessToken };
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
      console.log("Error from passport.js file fboauth-", error);
      return cb(error);
    }
  }
);

passport.serializeUser((user, done) => {
  /*The serializeUser() attaches the {authenticated_user} 
    object to end of “req.session.passport”
    i.e. req.session.passport.user.{authenticated_user}*/
  console.log("sterilizeUser called", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  /*The deserializeUser() reads the {authenticated_user} object from the 
      “req.session.passport.user.{authenticated_user}”,
     and attaches it to “req.user” i.e. req.user.{authenticated_user}*/
  console.log("DeSterilizeUser called", user);
  done(null, user);
});

export default facebookAuthStrategy;
