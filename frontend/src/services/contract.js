import { BrowserProvider, Contract, formatEther } from "ethers";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const CONTRACT_ABI = [
  {
    inputs: [],
    name: "contractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "eligible",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasReceived",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },

  {
    inputs: [],
    name: "ubiAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

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

  const [eligible, hasReceived, ubiAmount, contractBalance, owner] =
    await Promise.all([
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