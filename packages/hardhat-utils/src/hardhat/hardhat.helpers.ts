import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import type {
  HardhatNetworkUserConfig,
  NetworkUserConfig,
} from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

export type AutoOptions = {
  goerli: "auto" | number;
  hardhat: "auto" | number;
  mainnet: "auto" | number;
  sepolia: "auto" | number;
  "arb-mainnet": "auto" | number;
  "arb-rinkeby": "auto" | number;
  "ply-mainnet": "auto" | number;
  "ply-mumbai": "auto" | number;
  "opt-mainnet": "auto" | number;
  "opt-kovan": "auto" | number;
  "palm-mainnet": "auto" | number;
  "palm-rinkeby": "auto" | number;
};

export enum EndpointProvider {
  infura = "infura",
  alchemy = "alchemy",
}

export type EndpointsConfig = {
  [key in EndpointProvider]: {
    goerli: string;
    hardhat: string;
    mainnet: string;
    sepolia: string;
    "arb-mainnet": string;
    "arb-rinkeby": string;
    "ply-mainnet": string;
    "ply-mumbai": string;
    "opt-mainnet": string;
    "opt-kovan": string;
    "palm-mainnet"?: string;
    "palm-rinkeby"?: string;
  };
};

export const ChainIds = {
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  sepolia: 11155111,
  "arb-rinkeby": 421611,
  "arb-mainnet": 42161,
  "ply-mainnet": 137,
  "ply-mumbai": 80001,
  "opt-mainnet": 10,
  "opt-kovan": 69,
  "palm-mainnet": 11297108109,
  "palm-rinkeby": 11297108099,
};

export const GasPrice: AutoOptions = {
  goerli: "auto",
  hardhat: "auto",
  mainnet: "auto",
  sepolia: "auto",
  "arb-rinkeby": "auto",
  "arb-mainnet": "auto",
  "ply-mainnet": "auto",
  "ply-mumbai": "auto",
  "opt-mainnet": "auto",
  "opt-kovan": "auto",
  "palm-mainnet": "auto",
  "palm-rinkeby": "auto",
};

export const Gas: AutoOptions = {
  goerli: "auto",
  hardhat: "auto",
  mainnet: "auto",
  sepolia: "auto",
  "arb-rinkeby": 1287983320,
  "arb-mainnet": "auto",
  "ply-mainnet": "auto",
  "ply-mumbai": "auto",
  "opt-mainnet": "auto",
  "opt-kovan": "auto",
  "palm-mainnet": "auto",
  "palm-rinkeby": "auto",
};

export const EndpointURLs: EndpointsConfig = {
  infura: {
    goerli: "https://goerli.infura.io/v3/",
    hardhat: "https://mainnet.infura.io/v3/",
    mainnet: "https://mainnet.infura.io/v3/",
    sepolia: "https://sepolia.infura.io/v3/",
    "arb-mainnet": "https://arbitrum-mainnet.infura.io/v3/",
    "arb-rinkeby": "https://arbitrum-rinkeby.infura.io/v3/",
    "ply-mainnet": "https://polygon-mainnet.infura.io/v3/",
    "ply-mumbai": "https://polygon-mumbai.infura.io/v3/",
    "opt-mainnet": "https://optimism-mainnet.infura.io/v3/",
    "opt-kovan": "https://optimism-kovan.infura.io/v3/",
    "palm-mainnet": "https://palm-mainnet.infura.io/v3/",
    "palm-rinkeby": "https://palm-rinkeby.infura.io/v3/",
  },
  alchemy: {
    goerli: "https://eth-goerli.g.alchemy.com/v2/",
    hardhat: "https://eth-mainnet.g.alchemy.com/v2/",
    mainnet: "https://eth-mainnet.g.alchemy.com/v2/",
    sepolia: "https://eth-sepolia.g.alchemy.com/v2/",
    "arb-mainnet": "https://arb-mainnet.g.alchemy.com/v2/",
    "arb-rinkeby": "https://arb-rinkeby.g.alchemy.com/v2/",
    "ply-mainnet": "https://polygon-mainnet.g.alchemy.com/v2/",
    "ply-mumbai": "https://polygon-mumbai.g.alchemy.com/v2/",
    "opt-mainnet": "https://optimism-mainnet.g.alchemy.com/v2/",
    "opt-kovan": "https://optimism-kovan.g.alchemy.com/v2/",
    "palm-mainnet": "",
    "palm-rinkeby": "",
  },
};

export const Networks = Object.keys(ChainIds);
export type NetworksType = keyof typeof ChainIds;

// Ensure that we have all the environment variables we need.

if (!process.env.DEPLOYER_MNEMONIC) {
  throw new Error("Please set your DEPLOYER_MNEMONIC in a .env file");
}
export const walletSeed: string = process.env.DEPLOYER_MNEMONIC;

const endpointProvider: string =
  process.env.VITE_ENDPOINT_PROVIDER != null
    ? process.env.VITE_ENDPOINT_PROVIDER
    : "";
if (endpointProvider !== "infura" && endpointProvider !== "alchemy") {
  throw new Error(
    "Please set your VITE_ENDPOINT_PROVIDER to a valid value in a .env file"
  );
}

let endpointApiKey: string;
if (endpointProvider === "infura") {
  if (!process.env.VITE_INFURA_KEY) {
    throw new Error("Please set your VITE_INFURA_KEY in a .env file");
  }
  endpointApiKey = process.env.VITE_INFURA_KEY;
}

if (endpointProvider === "alchemy") {
  if (!process.env.VITE_ALCHEMY_KEY) {
    throw new Error("Please set your VITE_ALCHEMY_KEY in a .env file");
  }
  endpointApiKey = process.env.VITE_ALCHEMY_KEY;
}

const configMaxGas: number | undefined = Number(process.env.MAX_GAS);
const configGasPrice: number | undefined = Number(
  process.env.DEPLOYMENT_GAS_PRICE
);

export function getHardhatChainConfig(): HardhatNetworkUserConfig {
  return {
    accounts: {
      mnemonic: "test test test test test test test test test test test junk",
      path: "m/44'/60'/0'/0/",
      initialIndex: 0,
      count: 20,
    },
    chainId: ChainIds.hardhat,
  };
}

export function getLocalhostChainConfig(): NetworkUserConfig {
  return {
    url: "http://127.0.0.1:8545",
    accounts: {
      mnemonic: walletSeed,
      path: "m/44'/60'/0'/0/",
      initialIndex: 0,
      count: 20,
    },
  };
}

export function getChainConfig(network: NetworksType): NetworkUserConfig {
  const provider: EndpointProvider = <EndpointProvider>endpointProvider;
  const url: string = EndpointURLs[provider][network] + endpointApiKey;
  return {
    accounts: {
      count: 20,
      mnemonic: walletSeed,
      path: "m/44'/60'/0'/0",
    },
    chainId: ChainIds[network],
    gas: configMaxGas || Gas[network] || "auto",
    gasPrice: configGasPrice || GasPrice[network] || "auto",
    url,
  };
}

export function getEtherscanApiKey(): string {
  if (!process.env.ETHERSCAN_API_KEY) {
    return "";
  }

  try {
    return JSON.parse(process.env.ETHERSCAN_API_KEY);
  } catch (e) {
    return process.env.ETHERSCAN_API_KEY;
  }
}
