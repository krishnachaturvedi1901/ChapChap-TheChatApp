import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 50,
      required: false,
      validate: {
        validator: (value) => {
          if (value?.length > 50) return false;
          return /^[a-zA-Z\s]*$/.test(value) && value !== "";
        },
        message: (props) => {
          if (props.value?.length > 50) {
            return "Name length must not exceed 50 characters";
          } else {
            return "Name must not contain numbers, punctuations, or be an empty string";
          }
        },
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
      required: false,
      validate: {
        validator: (value) => {
          return !isNaN(value) && value >= 18 && value <= 100;
        },
        message: (props) => {
          if (isNaN(props.value)) {
            return "Age must be a valid number";
          } else if (props.value < 18) {
            return "Age must be atleast 18 years old";
          } else if (props.value > 100) {
            return "Age must not exceed 100 years old";
          }
        },
      },
    },
    gender: {
      type: String,
      required: false,
      validate: {
        validator: (value) => {
          const acceptedValues = /^(male|female|other)$/i;
          return acceptedValues.test(value);
        },
        message: "Only 'Male','Female', or 'Other' is accepted",
      },
    },
    companyName: {
      type: String,
      maxLength: 60,
      trim: true,
      required: false,
      validate: {
        validator: (value) => {
          if (value?.length > 60) return false;
          return /^[a-zA-Z\s]*$/.test(value) && value !== "";
        },
        message: (props) => {
          if (props.value?.length > 50) {
            return "Company name length must not exceed 60 characters";
          } else {
            return "Company name must not contain numbers, punctuations, or be an empty string";
          }
        },
      },
    },
    experience: {
      type: Number,
      min: 0,
      max: 99,
      required: false,
      validate: {
        validator: (value) => {
          return !isNaN(value) && +value >= 0 && +value <= 99;
        },
        message: "Experience must be a valid number",
      },
    },
    joinDate: {
      type: String,
      required: false,
    },
    endDate: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      validate: {
        validator: function (value) {
          const emailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegx.test(value)) return false;
          return value !== null;
        },
        message: "Email must not be null and be in valid format",
      },
    },
    password: {
      type: String,
      required: false,
      validate: {
        validator: (value) => {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/.test(
            value
          );
        },
        message:
          "Password must be at least 8 characters long, contain at least one uppercase, one lowercase, one digit, and one special character",
      },
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);
