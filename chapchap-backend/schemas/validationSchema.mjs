import Joi from "joi";

const passwordRegx = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!.@#$%^&*])(?=.{8,})"
);
const emailRegx = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");
const genderRegx = new RegExp("^(male|female|other)$", "i");

const personalInfoSchema = Joi.object().keys({
  name: Joi.string().required().min(3).max(50),
  age: Joi.number().min(18).max(100).required(),
  gender: Joi.string().pattern(genderRegx).required(),
});

const companyInfoSchema = Joi.object().keys({
  companyName: Joi.string().required().min(3).max(60),
  experience: Joi.number().min(0).max(90).required(),
  joinDate: Joi.string().required(),
  endDate: Joi.string().required(),
});

const authInfoSchema = Joi.object().keys({
  email: Joi.string().pattern(emailRegx).required(),
  password: Joi.string().pattern(passwordRegx).min(8).required(),
});

export default {
  "/auth/signup/personalInfo": personalInfoSchema,
  "/auth/signup/companyInfo": companyInfoSchema,
  "/auth/signup/register": authInfoSchema,
};
