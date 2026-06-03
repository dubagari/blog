import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(errorHandler(403, "Forbidden"));
    }

    // Debug logs
    console.log("decoded:", decoded);
    console.log("user ID:", decoded.id);

    const user = await User.findById(decoded.id).select("-password");
    console.log("FOUND USER:", user._id);

    console.log("decoded id:", decoded.id);

    // const allUsers = await User.find();
    // console.log("ALL USERS:", allUsers);

    // console.log("FOUND USER:", user);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    req.user = user;

    next();
  });
};
