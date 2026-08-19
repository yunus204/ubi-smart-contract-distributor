import express from "express";
import { ethers } from "ethers";
import User from "../models/User.js";
import { comparePassword, createToken, hashPassword } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, walletAddress } = req.body;

    if (!name || !email || !password || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "name, email, password and walletAddress are required"
      });
    }

    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ethereum wallet address"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({
      $or: [{ email: normalizedEmail }, { walletAddress }]
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email or wallet address already registered"
      });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      walletAddress
    });

    res.status(201).json({
      success: true,
      message: "Registration submitted for admin verification",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        verificationStatus: user.verificationStatus,
        eligible: user.eligible
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        verificationStatus: user.verificationStatus,
        eligible: user.eligible
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.auth.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        verificationStatus: user.verificationStatus,
        eligible: user.eligible
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
export default router;
