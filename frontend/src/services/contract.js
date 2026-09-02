import {
  BrowserProvider,
  Contract,
  formatEther,
} from "ethers";

import contractConfig from "../config/contract.json";

// Contract address and ABI are generated automatically
// by blockchain/scripts/deploy.js
const CONTRACT_ADDRESS = contractConfig.address;
const CONTRACT_ABI = contractConfig.abi;

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new BrowserProvider(window.ethereum);

  return new Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    provider
  );
}

export async function getBlockchainUserData(walletAddress) {
  const contract = await getContract();

  const [
    eligible,
    hasReceived,
    ubiAmount,
    contractBalance,
    owner,
  ] = await Promise.all([
    contract.eligible(walletAddress),
    contract.hasReceived(walletAddress),
    contract.ubiAmount(),
    contract.contractBalance(),
    contract.owner(),
  ]);

  return {
    eligible,
    hasReceived,
    ubiAmount: formatEther(ubiAmount),
    contractBalance: formatEther(contractBalance),
    owner,
  };
}

export { CONTRACT_ADDRESS };