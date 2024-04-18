import mongoose from "mongoose";
import { oauthUserSchema } from "../schemas/oauthUserSchema.mjs";

export const OAuthUserModel = mongoose.model("OAuthUsers", oauthUserSchema);
