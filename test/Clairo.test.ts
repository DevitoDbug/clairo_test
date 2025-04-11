import { expect } from "chai";
import { ethers } from "hardhat";

describe("ClairoProof", function () {
  async function deploy() {
    const [owner, other] = await ethers.getSigners();
    const Clairo = await ethers.getContractFactory("ClairoProof");
    const clairo = await Clairo.deploy();
    return { clairo, owner, other };
  }

  it("Should store and verify evidence", async function () {
    const { clairo, owner } = await deploy();
    const mediaHash = ethers.keccak256(ethers.toUtf8Bytes("test.jpg"));
    const metadataHash = ethers.keccak256(
      ethers.toUtf8Bytes("location=40.7128,-74.0060")
    );

    await clairo.submitProof(mediaHash, metadataHash, 40712800, -74006000);
    expect(await clairo.verifyProof(mediaHash)).to.be.true;
  });
});
