import express from "express";
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:postId", verifyToken, createComment);

router.get("/:postId", getComments);

router.put("/:id", verifyToken, updateComment);

router.delete("/:id", verifyToken, deleteComment);

export default router;
