import { ethers } from "hardhat";

async function main() {
  // Deploy a sample contract (e.g., a simple "Greeter" contract)
  const ClairoProof = await ethers.getContractFactory("ClairoProof");
  const clairoProof = await ClairoProof.deploy();

  await clairoProof.waitForDeployment();

  // Get the deployment address
  const deployedAddress = await clairoProof.getAddress();
  console.log("ClairoProof deployed to:", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
