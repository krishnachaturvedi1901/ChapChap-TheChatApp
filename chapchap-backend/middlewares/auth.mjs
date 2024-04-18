import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";

export const authorize = (req, res, next) => {
  const tokenArr = req.headers["authorization"].split(" ");
  const token = tokenArr[1];

  if (token) {
    try {
      jwt.verify(token, config.jwt_secret, (err, payload) => {
        if (err) {
          next(createHttpError.Unauthorized("Invalid token"));
        } else {
          req.payload = payload;
          next();
        }
      });
    } catch (error) {}
  } else {
    next(createHttpError.Unauthorized("Token not found"));
  }
};
