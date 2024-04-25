import express from "express";
import cors from "cors";
import connectDb from "./connect/db.mjs";
import { config } from "./config/config.mjs";
import { authRoute } from "./routes/authRoutes.mjs";
import createHttpError from "http-errors";
import passport from "passport";
import session from "express-session";
import googleAuthStrategy from "./helper/passportGoogleOauthStrategy.mjs";
import { default as cookieParser } from "cookie-parser";
import facebookAuthStrategy from "./helper/passportFbOauthStrategy.mjs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard-cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.node_env === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(googleAuthStrategy);
passport.use(facebookAuthStrategy);

app.use("/auth", authRoute);

app.use("*", (req, res, next) => {
  next(createHttpError.NotFound("Invalid endpoint"));
});

app.use((err, req, res, next) => {
  console.log("error from unknow route-", err.message);
  res.status(err.status || 500).send({
    status: err.status || 500,
    error: err.message,
  });
});

connectDb()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.log("Error in running server", err);
    process.exit(1);
  });
