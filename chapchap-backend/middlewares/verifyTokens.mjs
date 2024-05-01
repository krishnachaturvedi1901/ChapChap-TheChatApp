import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";
import { TOKEN_ENUMS } from "../enums/enums.mjs";

export const verifyAccessToken = (req, res, next) => {
  // console.log(req);
  console.log("req.cookies-", req.cookies);
  const { accessToken, refreshToken } = req?.cookies;
  console.log("Getting aceesToken-", accessToken);
  console.log("Getting refreshTok inside midd-", refreshToken);
  console.log(" config.jwt_accessToken_secret=", config.jwt_accessToken_secret);
  if (accessToken) {
    try {
      jwt.verify(accessToken, config.jwt_accessToken_secret, (err, payload) => {
        if (err) {
          req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
          req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
          if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
            req.cookies[TOKEN_ENUMS.SESSIONID] = "";
          }
          console.log("Invalid accessToken error", err);
          next();
        } else {
          const userId = payload.aud;
          req.payload = userId;
          next();
        }
      });
    } catch (error) {
      req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
      req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
      if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
        req.cookies[TOKEN_ENUMS.SESSIONID] = "";
      }
      console.log("Invalid accessToken from catch");
      next();
    }
  } else {
    console.log("Invalid accessToken from else");
    next();
  }
};

export const verifyRefreshToken = (req, res, next) => {
  const { accessToken, refreshToken } = req?.cookies;
  console.log(req);
  console.log("Getting aceesToken-", accessToken);
  console.log("Getting refreshTok inside midd-", refreshToken);
  if (refreshToken) {
    try {
      jwt.verify(
        refreshToken,
        config.jwt_refreshToken_secret,
        (err, payload) => {
          if (err) {
            next(createHttpError.Unauthorized("Invalid token"));
          } else {
            const userId = payload.aud;
            req.payload = userId;
            next();
          }
        }
      );
    } catch (error) {
      next(createHttpError.Unauthorized("Invalid token"));
    }
  } else {
    return next(createHttpError.Unauthorized("Token not found"));
  }
};
