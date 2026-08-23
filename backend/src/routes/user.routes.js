import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { distributeUBI } from "../services/blockchain.service.js";

const router = express.Router();

// Get logged-in user's information
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load user information",
    });
  }
});

// Get logged-in user's transaction history
router.get("/transactions/me", requireAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.auth.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Get transactions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load transaction history",
    });
  }
});

// Claim UBI
router.post("/claim", requireAuth, async (req, res) => {
  try {
    // Find the logged-in user from the JWT
    const user = await User.findById(req.auth.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check whether the user has been approved
    if (user.verificationStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Your account has not been approved yet.",
      });
    }

    // Check blockchain eligibility stored in MongoDB
    if (!user.eligible) {
      return res.status(400).json({
        success: false,
        message: "Your account is not eligible for UBI.",
      });
    }

    // Prevent the same user from receiving UBI twice
    const existingTransaction = await Transaction.findOne({
      user: user._id,
      type: "UBI_DISTRIBUTION",
      status: "confirmed",
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: "You have already received your UBI.",
        transaction: existingTransaction,
      });
    }

    // UBI amount from .env, with 0.01 ETH as fallback
    const amountEth = process.env.UBI_AMOUNT_ETH || "0.01";

    // Send UBI through the smart contract
    const result = await distributeUBI(user.walletAddress);

    // Save blockchain transaction in MongoDB
    await Transaction.create({
      user: user._id,
      walletAddress: user.walletAddress,
      amountEth,
      txHash: result.txHash,
      type: "UBI_DISTRIBUTION",
      status: "confirmed",
    });

    // Update user's total received amount
    user.totalReceived = (
      Number(user.totalReceived || "0") +
      Number(amountEth)
    ).toString();

    await user.save();

    res.json({
      success: true,
      message: "UBI claimed successfully",
      amountEth,
      txHash: result.txHash,
    });
  } catch (error) {
    console.error("UBI claim error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "UBI claim failed",
    });
  }
});

export default router;