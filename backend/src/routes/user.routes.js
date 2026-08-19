import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.auth.userId).select("-passwordHash");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, user });
});

router.get("/transactions/me", requireAuth, async (req, res) => {
  const transactions = await Transaction.find({
    user: req.auth.userId
  }).sort({ createdAt: -1 });

  res.json({ success: true, transactions });
});

export default router;
