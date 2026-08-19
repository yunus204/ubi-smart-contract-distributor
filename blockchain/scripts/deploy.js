const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // 0.01 ETH in wei for the default MVP distribution.
  const ubiAmount = hre.ethers.parseEther("0.01");

  const Factory = await hre.ethers.getContractFactory("UBIDistributor");
  const contract = await Factory.deploy(ubiAmount);

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("UBIDistributor deployed to:", address);
  console.log("Owner:", deployer.address);
  console.log("UBI amount:", hre.ethers.formatEther(ubiAmount), "ETH");

  const artifact = await hre.artifacts.readArtifact("UBIDistributor");

  const backendConfigDir = path.resolve(__dirname, "../../backend/src/config");
  fs.mkdirSync(backendConfigDir, { recursive: true });

  fs.writeFileSync(
    path.join(backendConfigDir, "contract.json"),
    JSON.stringify(
      {
        address,
        abi: artifact.abi
      },
      null,
      2
    )
  );

  console.log("Backend contract config written to backend/src/config/contract.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
