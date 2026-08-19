const { ethers } = require("hardhat");

async function main() {
  const contractAddress =
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const userWallet =
    "0x0000000000000000000000000000000000000001";

  const contract = await ethers.getContractAt(
    "UBIDistributor",
    contractAddress
  );

  console.log("Contract:", contractAddress);
  console.log("User:", userWallet);

  const eligible = await contract.eligible(userWallet);
  console.log("Eligible:", eligible);

  const hasReceived = await contract.hasReceived(userWallet);
  console.log("Already received:", hasReceived);

  const balanceBefore = await ethers.provider.getBalance(userWallet);

  console.log(
    "User balance before:",
    ethers.formatEther(balanceBefore),
    "ETH"
  );

  const tx = await contract.distribute(userWallet);

  console.log("Distribution transaction:", tx.hash);

  const receipt = await tx.wait();

  console.log("Distribution confirmed");
  console.log("Block:", receipt.blockNumber);

  const balanceAfter = await ethers.provider.getBalance(userWallet);

  console.log(
    "User balance after:",
    ethers.formatEther(balanceAfter),
    "ETH"
  );

  const contractBalance = await contract.contractBalance();

  console.log(
    "Contract balance:",
    ethers.formatEther(contractBalance),
    "ETH"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});