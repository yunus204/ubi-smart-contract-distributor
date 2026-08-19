import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadContractConfig() {
  const file = path.join(__dirname, "../config/contract.json");

  if (!fs.existsSync(file)) {
    throw new Error("Contract config not found. Deploy the Solidity contract first.");
  }

  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function getProvider() {
  if (!process.env.RPC_URL) {
    throw new Error("RPC_URL is missing.");
  }
  return new ethers.JsonRpcProvider(process.env.RPC_URL);
}

function getSigner() {
  if (!process.env.ADMIN_PRIVATE_KEY) {
    throw new Error("ADMIN_PRIVATE_KEY is missing.");
  }

  return new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, getProvider());
}

function getContract() {
  const config = loadContractConfig();
  return new ethers.Contract(config.address, config.abi, getSigner());
}

export async function getContractBalance() {
  const provider = getProvider();
  const config = loadContractConfig();
  const balance = await provider.getBalance(config.address);
  return ethers.formatEther(balance);
}

export async function depositFunds(amountEth) {
  const signer = getSigner();
  const config = loadContractConfig();

  const tx = await signer.sendTransaction({
    to: config.address,
    value: ethers.parseEther(amountEth)
  });

  const receipt = await tx.wait();

  return {
    txHash: receipt.hash
  };
}

export async function approveOnChain(walletAddress) {
  const contract = getContract();
  const tx = await contract.setEligible(walletAddress, true);
  const receipt = await tx.wait();

  return { txHash: receipt.hash };
}

export async function distributeUBI(walletAddress) {
  const contract = getContract();
  const tx = await contract.distribute(walletAddress);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash
  };
}
