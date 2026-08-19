import express from "express";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { requireAdmin, requireAuth } from "../middleware/auth.middleware.js";
import {
  approveOnChain,
  depositFunds,
  distributeUBI,
  getContractBalance
} from "../services/blockchain.service.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", async (_req, res) => {
  const users = await User.find({ role: "user" })
    .select("-passwordHash")
    .sort({ createdAt: -1 });

  res.json({ success: true, users });
});

router.patch("/users/:id/verify", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be approved or rejected"
      });
    }

    const user = await User.findById(req.params.id);

    if (!user || user.role !== "user") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.verificationStatus = status;
    user.eligible = status === "approved";

    let blockchainTx = null;

    if (status === "approved") {
      blockchainTx = await approveOnChain(user.walletAddress);
    }

    await user.save();

    res.json({
      success: true,
      message: `User ${status}`,
      user: {
        id: user._id,
        verificationStatus: user.verificationStatus,
        eligible: user.eligible
      },
      blockchainTx
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/stats", async (_req, res) => {
  const [totalUsers, approvedUsers, pendingUsers, distributions, contractBalance] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", verificationStatus: "approved" }),
      User.countDocuments({ role: "user", verificationStatus: "pending" }),
      Transaction.countDocuments(),
      getContractBalance()
    ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      approvedUsers,
      pendingUsers,
      distributions,
      contractBalanceEth: contractBalance
    }
  });
});

router.post("/contract/deposit", async (req, res) => {
  try {
    const amountEth = String(req.body.amountEth || "");

    if (!amountEth || Number(amountEth) <= 0) {
      return res.status(400).json({
        success: false,
        message: "amountEth must be greater than 0"
      });
    }

    const result = await depositFunds(amountEth);

    res.json({
      success: true,
      message: "Funds deposited into the smart contract",
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/distribute/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || user.role !== "user") {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.eligible || user.verificationStatus !== "approved") {
      return res.status(400).json({
        success: false,
        message: "User is not eligible for UBI distribution"
      });
    }

    const amountEth = process.env.UBI_AMOUNT_ETH || "0.01";
    const result = await distributeUBI(user.walletAddress);

    await Transaction.create({
      user: user._id,
      walletAddress: user.walletAddress,
      amountEth,
      txHash: result.txHash
    });

    user.totalReceived = (
      Number(user.totalReceived || "0") + Number(amountEth)
    ).toString();

    await user.save();

    res.json({
      success: true,
      message: "UBI distributed successfully",
      amountEth,
      txHash: result.txHash
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
