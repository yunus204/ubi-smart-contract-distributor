const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();

  const contractAddress =
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const contract = await ethers.getContractAt(
    "UBIDistributor",
    contractAddress
  );

  const amount = ethers.parseEther("0.05");

  console.log("Owner:", owner.address);
  console.log("Depositing:", ethers.formatEther(amount), "ETH");

  const tx = await owner.sendTransaction({
    to: contractAddress,
    value: amount
  });

  console.log("Transaction:", tx.hash);

  await tx.wait();

  console.log("Deposit confirmed");

  const balance = await contract.contractBalance();

  console.log(
    "Contract balance:",
    ethers.formatEther(balance),
    "ETH"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});