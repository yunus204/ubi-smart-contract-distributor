import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    walletAddress: {
      type: String,
      required: true
    },
    amountEth: {
      type: String,
      required: true
    },
    txHash: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ["UBI_DISTRIBUTION"],
      default: "UBI_DISTRIBUTION"
    },
    status: {
      type: String,
      enum: ["confirmed", "failed"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
