import { errorHandler } from "../util/error.js";

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return next(errorHandler(401, "Not authenticated"));
    }

    if (req.user.role !== "admin") {
      return next(errorHandler(403, "Access denied: Admins only"));
    }

    next();
  } catch (error) {
    next(error);
  }
};
