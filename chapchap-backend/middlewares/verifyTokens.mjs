import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";
import { TOKEN_ENUMS } from "../enums/enums.mjs";

export const verifyAccessToken = (req, res, next) => {
  const { accessToken_chapchap, refreshToken_chapchap } = req?.cookies;
  console.log(req);
  console.log("Getting aceesToken-", accessToken_chapchap);
  console.log("Getting refreshTok inside midd-", refreshToken_chapchap);
  if (accessToken_chapchap) {
    try {
      jwt.verify(
        accessToken_chapchap,
        config.jwt_accessToken_secret,
        (err, payload) => {
          if (err) {
            req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
            req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
            if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
              req.cookies[TOKEN_ENUMS.SESSIONID] = "";
            }
            console.log("Invalid accessToken_chapchap main error");
            next();
          } else {
            const userId = payload.aud;
            req.payload = userId;
            next();
          }
        }
      );
    } catch (error) {
      req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
      req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
      if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
        req.cookies[TOKEN_ENUMS.SESSIONID] = "";
      }
      console.log("Invalid accessToken_chapchap from catch");
      next();
    }
  } else {
    console.log("Invalid accessToken_chapchap from else");
    next();
  }
};

export const verifyRefreshToken = (req, res, next) => {
  const { accessToken_chapchap, refreshToken_chapchap } = req?.cookies;
  console.log(req);
  console.log("Getting aceesToken-", accessToken_chapchap);
  console.log("Getting refreshTok inside midd-", refreshToken_chapchap);
  if (refreshToken_chapchap) {
    try {
      jwt.verify(
        refreshToken_chapchap,
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
