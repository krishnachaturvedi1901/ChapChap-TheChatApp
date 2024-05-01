import dotenv from "dotenv";
dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV,
  mongodb_url: process.env.MONGODB_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SIGNUP_SECRET,
  jwt_accessToken_secret: process.env.JWT_ACCESSKEY_SECRET,
  jwt_refreshToken_secret: process.env.JWT_REFRESHKEY_SECRET,
  google_oauth_clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  facebook_oauth_appId: process.env.FACEBOOK_OAUTH_APPID,
  facebook_oauth_secret: process.env.FACEBOOK_OAUTH_SECRET,
  clientUrl_onLoginSuccess: process.env.CLIENT_URL_ONSUCCESSAUTH,
  clientUrl_onLoginFailure: process.env.CLIENT_URL_ONFAILUREAUTH,
  redis_port: process.env.REDIS_PORT,
  redis_host: process.env.REDIS_HOST,
  session_minAge: process.env.SESSION_MINAGE,
  session_maxAge: process.env.SESSION_MAXAGE,
  redis_db_uri: process.env.REDIS_DB_URI,
  redis_password: process.env.REDIS_PASSWORD,
  accessToken_age: process.env.ACCESSTOKEN_AGE,
  refreshToken_age: process.env.REFRESHTOKEN_AGE,
  client_url: process.env.CLIENT_URL,
};
