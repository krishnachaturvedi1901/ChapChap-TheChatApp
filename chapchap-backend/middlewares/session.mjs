import { config } from "../config/config.mjs";
import session from "express-session";
import { redisStore } from "../connect/redis_connect.mjs";

export default session({
  store: redisStore,
  secret: "keyboard-cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: +config.session_minAge,
  },
});
