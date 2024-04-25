import createHttpError from "http-errors";
import { UserModel } from "../models/UsersModel.mjs";
import {
  createAccessToken,
  createJWT,
  createRefreshToken,
} from "../helper/createToken.mjs";
import { checkExistence } from "../helper/checkExistence.mjs";
import { checkAndCompareDates } from "../helper/isDateValid.mjs";
import { serializeToken } from "../helper/serializeToken.mjs";
import { TOKEN_ENUMS } from "../enums/enums.mjs";
import axios from "axios";
import { config } from "../config/config.mjs";

export async function registerPersonalInfo(req, res, next) {
  try {
    const personalInfo = req.body;
    const { name, age, gender } = personalInfo;
    const token = createJWT(personalInfo);
    return res.status(200).send({ token });
  } catch (error) {
    console.log(error, "-----------------------------------------------------");
    if (error.errors) {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("---1--->", errorMessages);
      next(createHttpError.NotAcceptable(errorMessages));
    } else {
      console.log("---2--->", error.message);
      next(createHttpError.NotAcceptable(error.message));
    }
  }
}

export async function registerCompanyInfo(req, res, next) {
  try {
    const personalInfo = req.payload;
    console.log("personalinfo---", personalInfo);
    const companyInfo = req.body;
    const { companyName, experience, joinDate, endDate } = companyInfo;

    if (!checkAndCompareDates(joinDate, endDate)) {
      return next(
        createHttpError.NotAcceptable(
          "Dates must be in dd/mm/yyyy format and endDate must be greater then joinDate"
        )
      );
    }
    // const updatedUser = await UserModel.findOneAndUpdate(
    //   { _id: personalInfo._id },
    //   { $set: { companyName, experience, joinDate, endDate } },
    //   { new: true }
    // );
    // {new:true} here return new updated obj rather then old original one
    const token = createJWT({ ...personalInfo, ...companyInfo });
    return res.status(200).send({ user: personalInfo, token });
  } catch (error) {
    console.log(error, "-----------------------------------------------------");
    if (error.errors) {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("---1--->", errorMessages);
      next(createHttpError.NotAcceptable(errorMessages));
    } else {
      console.log("---2--->", error.message);
      next(createHttpError.NotAcceptable(error.message));
    }
  }
}

export async function registerEmailPassword(req, res, next) {
  try {
    const personalAndCompanyInfo = req.payload;
    console.log("personalCompanyinfo---", personalAndCompanyInfo);
    const authInfo = req.body;
    const { email, password } = authInfo;

    const user = new UserModel({
      ...personalAndCompanyInfo,
      email,
      password,
    });
    const savedUser = await user.save();
    const addedUser = await UserModel.findById(savedUser._id);
    console.log("savedUser-", savedUser);
    if (addedUser.name && addedUser.companyName && addedUser.email) {
      const token = createJWT(addedUser.toObject());
      return res.status(200).send({ user: addedUser, token });
    } else {
      next(createHttpError.UnprocessableEntity("Unable to update db"));
    }
  } catch (error) {
    console.log(error, "-----------------------------------------------------");
    if (error.errors) {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("---1--->", errorMessages);
      next(createHttpError.NotAcceptable(errorMessages));
    } else {
      console.log("---2--->", error.message);
      next(createHttpError.NotAcceptable(error.message));
    }
  }
}

export async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return next(
        createHttpError.NotFound("Email either incorrect or not found")
      );
    }
    const isPassMatch = await user.verifyPassword(password);
    if (isPassMatch) {
      const userObj = user.toObject();
      delete userObj.password;
      const accessToken = await createAccessToken(user._id.toString());
      const refreshToken = await createRefreshToken(user._id.toString());
      const serializedAccessToken = serializeToken(
        TOKEN_ENUMS.ACCESSTOKEN,
        accessToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 60,
          path: "/",
          domain: "localhost",
        }
      );
      const serializedRefreshToken = serializeToken(
        TOKEN_ENUMS.REFRESHTOKEN,
        refreshToken,
        {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 120,
          path: "/",
          domain: "localhost",
        }
      );
      res.setHeader("Set-Cookie", [
        serializedAccessToken,
        serializedRefreshToken,
      ]);
      return res.status(200).send({
        user: userObj,
        token: accessToken,
        message: "User loggedin successfully",
      });
    } else {
      return next(createHttpError.Unauthorized("Invalid password"));
    }
  } catch (error) {
    console.log(error, "-----------------------------------------------------");
    if (error.errors) {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      console.log("---1--->", errorMessages);
      next(createHttpError.NotAcceptable(errorMessages));
    } else {
      console.log("---2--->", error.message);
      next(createHttpError.NotAcceptable(error.message));
    }
  }
}

// export function logoutHandler(req, res, next) {
//   req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
//   req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
//   if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
//     req.cookies[TOKEN_ENUMS.SESSIONID] = "";
//   }

//   if (req.sessionStore?.sessions) {
//     const sessionDataStringify =
//       req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)[0]];
//     if (sessionDataStringify) {
//       const sessionData = JSON.parse(sessionDataStringify);
//       const accessToken = sessionData?.passport?.user?.accessToken;
//       axios
//         .post(
//           `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`
//         )
//         .then(() => {
//           res.clearCookie("connect.sid");
//         })
//         .then(() => {
//           req.logout((err) => {
//             if (err) {
//               console.log("err from logut", err);
//               next(err);
//             }
//             return res.status(200).send({ message: "Logout successfull" });
//           });
//         })
//         .catch((err) => {
//           console.error("Error revoking access token:", err);
//           return res.redirect(config.clientUrl_onLoginFailure);
//         });
//     }
//   }
//   return res.status(200).send({ message: "Logout successfull" });
// }

export async function logoutHandler(req, res, next) {
  req.cookies[TOKEN_ENUMS.ACCESSTOKEN] = "";
  req.cookies[TOKEN_ENUMS.REFRESHTOKEN] = "";
  if (req.cookies[TOKEN_ENUMS.SESSIONID]) {
    req.cookies[TOKEN_ENUMS.SESSIONID] = "";
  }

  if (req.sessionStore?.sessions) {
    const sessionDataStringify =
      req.sessionStore.sessions[Object.keys(req.sessionStore.sessions)[0]];
    if (sessionDataStringify) {
      const sessionData = JSON.parse(sessionDataStringify);
      const accessToken = sessionData?.passport?.user?.accessToken;
      console.log("fromLogout-", accessToken);
      req.logout((err) => {
        if (err) {
          console.error("Error destroying session-2:", err);
          return next(
            createHttpError.InternalServerError("Unable to logout-2")
          );
        }
        console.log("NO ERROR IN REQ.LOGOUT");
      });

      try {
        const response = await axios.post(
          `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`
        );
        // console.log("res after google revoke loggout=", response);
        res.clearCookie("connect.sid");
        return res.status(200).send({ message: "Logout successful" });
      } catch (error) {
        console.error("Error revoking access token:", error);
        return next(createHttpError.InternalServerError("Unable to logout"));
      }
    }
  } else {
    return res.status(200).send({ message: "Logout successful" });
  }
}

export async function renewTokenHandler(req, res, next) {
  const userId = req.payload;
  console.log("Inside renewTokenHandler userid", userId);
  const accessToken = await createAccessToken(userId);
  const serializedAccessToken = serializeToken(
    TOKEN_ENUMS.ACCESSTOKEN,
    accessToken
  );
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Set-Cookie", serializedAccessToken);
  res.status(200).send({ token: accessToken });
}
