const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // Default UBI distribution amount: 0.01 ETH
  const ubiAmount = hre.ethers.parseEther("0.01");

  const Factory = await hre.ethers.getContractFactory("UBIDistributor");
  const contract = await Factory.deploy(ubiAmount);

  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("UBIDistributor deployed to:", address);
  console.log("Owner:", deployer.address);
  console.log(
    "UBI amount:",
    hre.ethers.formatEther(ubiAmount),
    "ETH"
  );

  // Get deployed contract ABI
  const artifact = await hre.artifacts.readArtifact("UBIDistributor");

  /*
   * ============================================================
   * BACKEND CONFIG
   * ============================================================
   */

  const backendConfigDir = path.resolve(
    __dirname,
    "../../backend/src/config"
  );

  fs.mkdirSync(backendConfigDir, { recursive: true });

  fs.writeFileSync(
    path.join(backendConfigDir, "contract.json"),
    JSON.stringify(
      {
        address,
        abi: artifact.abi,
      },
      null,
      2
    )
  );

  console.log(
    "Backend contract config written to backend/src/config/contract.json"
  );

  /*
   * ============================================================
   * FRONTEND CONFIG
   * ============================================================
   */

  const frontendConfigDir = path.resolve(
    __dirname,
    "../../frontend/src/config"
  );

  fs.mkdirSync(frontendConfigDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendConfigDir, "contract.json"),
    JSON.stringify(
      {
        address,
        abi: artifact.abi,
      },
      null,
      2
    )
  );

  console.log(
    "Frontend contract config written to frontend/src/config/contract.json"
  );

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("========================================");
  console.log("Contract:", address);
  console.log("Owner:", deployer.address);
  console.log("UBI Amount: 0.01 ETH");
  console.log("========================================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});