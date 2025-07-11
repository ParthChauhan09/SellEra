import AppError from "./AppError.js";

const wrapAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default wrapAsync;
