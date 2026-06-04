import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { errorHandler } from "../util/error.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();

    res.status(200).json({ userCount, postCount, commentCount });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return next(errorHandler(400, "Invalid role"));
    }

    if (req.user._id.toString() === id) {
      return next(errorHandler(400, "You cannot change your own role."));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    user.role = role;
    await user.save();

    res
      .status(200)
      .json({
        message: "User role updated",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return next(
        errorHandler(400, "Admins cannot delete their own account here."),
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
