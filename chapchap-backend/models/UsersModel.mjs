import mongoose from "mongoose";
import { UserSchema } from "../schemas/userSchema.mjs";
import bcrypt from "bcrypt";

UserSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
    }
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.verifyPassword = async function (inputPassword) {
  if (this.password) {
    return await bcrypt.compare(inputPassword, this.password);
  } else {
    return false;
  }
};

export const UserModel = mongoose.model("Users", UserSchema);
