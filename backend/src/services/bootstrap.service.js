import User from "../models/User.js";
import { hashPassword } from "./auth.service.js";

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL/ADMIN_PASSWORD not configured; skipping admin bootstrap.");
    return;
  }

  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      existing.verificationStatus = "approved";
      existing.eligible = true;
      await existing.save();
    }
    return;
  }

  const passwordHash = await hashPassword(password);

  await User.create({
    name: "System Administrator",
    email,
    passwordHash,
    walletAddress: "0x0000000000000000000000000000000000000000",
    role: "admin",
    verificationStatus: "approved",
    eligible: true
  });

  console.log(`Admin account created: ${email}`);
}
