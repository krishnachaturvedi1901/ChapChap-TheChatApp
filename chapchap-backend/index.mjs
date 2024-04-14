import express from "express";
import cors from "cors";
import connectDb from "./connect/db.mjs";
import { config } from "./config/config.mjs";
import { authRoute } from "./routes/authRoutes.mjs";
import createHttpError from "http-errors";
import cookieParser from "cookie-parser";
import passport from "passport";
import cookieSession from "cookie-session";
import googleAuthStrategy from "./helper/passport.mjs";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["googleAuthChatapp"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

passport.use(googleAuthStrategy);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoute);

app.use("*", (req, res, next) => {
  next(createHttpError.NotFound("Invalid endpoint"));
});

app.use((err, req, res, next) => {
  console.log("error from unknow route-", err.message);
  res.status(err.status).send({
    status: err.status,
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
