import { BrowserProvider } from "ethers";

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new BrowserProvider(window.ethereum);

  const accounts = await provider.send("eth_requestAccounts", []);

  return accounts[0];
};

export const getConnectedWallet = async () => {
  if (!window.ethereum) return null;

  const provider = new BrowserProvider(window.ethereum);

  const accounts = await provider.send("eth_accounts", []);

  return accounts.length ? accounts[0] : null;
};