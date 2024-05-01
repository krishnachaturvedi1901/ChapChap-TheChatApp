import createHttpError from "http-errors";

export const notFoundHandler = (req, res, next) => {
  next(createHttpError.NotFound(`Invalid endpoint-${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  console.log("error from unknow route-", err.message);
  return res.status(err.status || 500).send({
    status: err.status || 500,
    error: err.message,
  });
};
