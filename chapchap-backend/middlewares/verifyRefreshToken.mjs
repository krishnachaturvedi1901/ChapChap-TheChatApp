import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";

export const authorizeRefreshToken = (req, res, next) => {
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
    } catch (error) {}
  } else {
    return next(createHttpError.Unauthorized("Token not found"));
  }
};
