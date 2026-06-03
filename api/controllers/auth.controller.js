import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorHandler } from "../util/error.js";

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return next(errorHandler(400, "Please provide all fields"));
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) return next(errorHandler(400, "User already exists"));

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json("user created succesefully");
  } catch (error) {
    next(errorHandler(500, "Server Error", error.message));
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check user
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(400, "Invalid credentials"));

    // Compare password
    const isMatch = bcrypt.compareSync(password, validUser.password);

    if (!isMatch) return next(errorHandler(400, "Invalid credentials"));

    // Generate token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const { password: pass, ...ress } = validUser._doc;

    // Set token as httpOnly cookie and return token in response body
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      id: validUser._id,
      name: validUser.name,
      email: validUser.email,
      token,
    });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
