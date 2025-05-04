import jwt from "jsonwebtoken";
import Users from "../models/UserSchema.js";
import wrapAsync from "../utility/wrapAsync.js";
import AppError from "../utility/AppError.js";
import { JWT_SECRET } from "../config/keys.js";

const isUser = wrapAsync(async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new AppError("Unauthorized", 401));
    }

    const result = jwt.verify(token, JWT_SECRET);
    const findUser = await Users.findOne({ email: result.email });

    if (!findUser) {
      return next(new AppError("You are not authorized", 403));
    }
    findUser.password = "";
    findUser.image = "";
    req.user = findUser;
    next();
  } catch (err) {
    next(new AppError("Invalid token or authentication failed", 401));
  }
});

export default isUser;
