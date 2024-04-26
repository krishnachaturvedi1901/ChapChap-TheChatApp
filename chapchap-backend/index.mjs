import express from "express";
import cors from "cors";
import connectDb from "./connect/db.mjs";
import { config } from "./config/config.mjs";
import { authRoute } from "./routes/authRoutes.mjs";
import passport from "passport";
import googleAuthStrategy from "./helper/passportGoogleOauthStrategy.mjs";
import { default as cookieParser } from "cookie-parser";
import facebookAuthStrategy from "./helper/passportFbOauthStrategy.mjs";
import session from "./middlewares/session.mjs";
import { errorHandler, notFoundHandler } from "./controllers/errorHandler.mjs";

const app = express();

// If you run behind a proxy (e.g. nginx)
// app.set("trust proxy", 1)

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
passport.use(googleAuthStrategy);
passport.use(facebookAuthStrategy);
app.use("/auth", authRoute);
app.use("*", notFoundHandler);
app.use(errorHandler);

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
