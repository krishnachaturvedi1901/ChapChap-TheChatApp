import createHttpError from "http-errors";
import validationSchema from "../schemas/validationSchema.mjs";

const allowedMethods = ["POST"];

const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

export const schemaValidator = (path) => {
  const schema = validationSchema[path];

  if (!schema) {
    throw new Error(`Schema not found for path: ${path}`);
  }

  return (req, res, next) => {
    const method = req.method;

    if (!allowedMethods.includes(method)) {
      return next();
    }

    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const customError = {
        status: "failed",
        error: "Invalid request. Please review request and try again.",
      };

      const joiError = {
        status: "failed",
        error: error.details.map(({ message, type }) => {
          return message.replace(/['"]/g, "");
        }),
      };

      return res.status(422).json(joiError || customError);
    }

    req.body = value;
    return next();
  };
};
