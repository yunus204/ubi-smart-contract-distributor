const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UBIDistributor", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("UBIDistributor");
    const ubiAmount = ethers.parseEther("1");
    const contract = await Factory.deploy(ubiAmount);
    await contract.waitForDeployment();

    return { contract, owner, user, ubiAmount };
  }

  it("sets the deployer as owner", async function () {
    const { contract, owner } = await deployFixture();
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("allows owner to mark a user eligible", async function () {
    const { contract, user } = await deployFixture();

    await contract.setEligible(user.address, true);

    expect(await contract.eligible(user.address)).to.equal(true);
  });

  it("distributes UBI once to an eligible user", async function () {
    const { contract, user, ubiAmount } = await deployFixture();

    await contract.setEligible(user.address, true);

    await ownerSend(contract, ubiAmount);

    const before = await ethers.provider.getBalance(user.address);

    await contract.distribute(user.address);

    const after = await ethers.provider.getBalance(user.address);

    expect(after - before).to.equal(ubiAmount);
    expect(await contract.hasReceived(user.address)).to.equal(true);
  });

  it("rejects distribution to an ineligible user", async function () {
    const { contract, user } = await deployFixture();

    await expect(
      contract.distribute(user.address)
    ).to.be.revertedWith("User is not eligible");
  });

  async function ownerSend(contract, amount) {
    const [owner] = await ethers.getSigners();

    await owner.sendTransaction({
      to: await contract.getAddress(),
      value: amount
    });
  }
});
