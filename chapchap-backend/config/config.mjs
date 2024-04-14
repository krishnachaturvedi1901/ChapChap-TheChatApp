import dotenv from "dotenv";
dotenv.config();

export const config = {
  mongodb_url: process.env.MONGODB_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SIGNUP_SECRET,
  jwt_accessToken_secret: process.env.JWT_ACCESSKEY_SECRET,
  jwt_refreshToken_secret: process.env.JWT_REFRESHKEY_SECRET,
  google_oauth_clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
};
