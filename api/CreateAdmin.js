import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "../.env" });

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is undefined. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // 🔍 Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "adminblog@example.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return process.exit();
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("adminblog123", 10);

    // 👤 Create admin
    const admin = new User({
      name: "Admin",
      email: "adminblog@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
