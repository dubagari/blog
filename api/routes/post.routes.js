import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  toggleLikePost,
} from "../controllers/post.controller.js";

import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getPosts);
router.get("/:id", getPost);

/* PROTECTED */
router.post("/", verifyToken, upload.single("image"), createPost);
router.put("/:id", verifyToken, upload.single("image"), updatePost);
router.delete("/:id", verifyToken, deletePost);

/* LIKES */
router.put("/:id/like", verifyToken, toggleLikePost);

export default router;
