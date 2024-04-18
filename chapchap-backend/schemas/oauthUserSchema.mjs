import mongoose from "mongoose";

export const oauthUserSchema = new mongoose.Schema(
  {
    provider: String,
    userOauthId: String,
    userId: String,
    userEmail: String,
  },
  {
    versionKey: false,
    timestamps: false,
  }
);
