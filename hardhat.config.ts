import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables first
dotenv.config({ path: __dirname + "/.env" });
// Add to hardhat.config.ts
console.log("Private Key Length:", process.env.PRIVATE_KEY?.length);

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL!,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
