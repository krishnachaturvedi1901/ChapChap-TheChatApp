import createHttpError from "http-errors";
import { TOKEN_ENUMS } from "../enums/enums.mjs";
import { UserModel } from "../models/UsersModel.mjs";

export const verifyOauthSession = async (req, res, next) => {
  const userId = req.payload;
  if (userId) {
    try {
      const user = await UserModel.findById({ _id: userId });
      return res.status(200).send({ isAuthorize: true, user: user });
    } catch (error) {
      req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
      req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
      if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
        req.cookies[TOKEN_ENUMS.SESSIONID] = "";
      }
      console.log("Invalid userId from token user not found.", error);
    }
  }
  if (req.sessionStore?.sessions) {
    const sessionDataStringify =
      req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)[0]];
    if (sessionDataStringify) {
      const sessionData = JSON.parse(sessionDataStringify);
      const user = sessionData?.passport?.user?._doc;
      if (user?._id) {
        return res.status(200).send({
          isAuthorize: true,
          user,
        });
      }
    }
  }
  return next(createHttpError.Unauthorized("Session expires login again"));
};
