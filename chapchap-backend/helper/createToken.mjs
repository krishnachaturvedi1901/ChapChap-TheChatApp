import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";
import createHttpError from "http-errors";

export function createJWT(payload) {
  return jwt.sign(payload, config.jwt_secret, {
    algorithm: "HS256",
  });
}

export async function createAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: "30s",
      issuer: "jwt-message-app",
      audience: userId,
    };
    jwt.sign({}, config.jwt_accessToken_secret, options, (err, token) => {
      if (err) {
        return reject(
          createHttpError.InternalServerError("Error in token creation")
        );
      }
      resolve(token);
    });
  });
}

export async function createRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const options = {
      expiresIn: "120s",
      issuer: "jwt-message-app",
      audience: userId,
    };
    jwt.sign({}, config.jwt_refreshToken_secret, options, (err, token) => {
      if (err) {
        return reject(
          createHttpError.InternalServerError("Error in token creation")
        );
      }
      resolve(token);
    });
  });
}
