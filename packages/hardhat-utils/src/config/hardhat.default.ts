import '@nomicfoundation/hardhat-toolbox-viem'
import 'hardhat-abi-exporter'
import 'solidity-docgen'

import type { HardhatUserConfig } from 'hardhat/config'

import {
  getChainConfig,
  getHardhatChainConfig,
  getLocalhostChainConfig,
  getEtherscanApiKey,
} from './hardhat.helpers'

export const DefaultHardhatConfig: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  gasReporter: {
    currency: 'USD',
    coinmarketcap: `${process.env.COINMARKETCAP_API_KEY}`,
    enabled: process.env.CONTRACTS_ENABLE_GAS_REPORT === 'true',
    excludeContracts: [],
    src: './contracts',
    outputFile: process.env.CONTRACTS_GAS_REPORT_FILE,
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  solidity: {
    compilers: [],
  },
  networks: {
    localhost: getLocalhostChainConfig(),
    hardhat: getHardhatChainConfig(),
    goerli: getChainConfig('goerli'),
    sepolia: getChainConfig('sepolia'),
    'arb-mainnet': getChainConfig('arb-mainnet'),
    'arb-rinkeby': getChainConfig('arb-rinkeby'),
    'ply-mainnet': getChainConfig('ply-mainnet'),
    'ply-mumbai': getChainConfig('ply-mumbai'),
    'opt-mainnet': getChainConfig('opt-mainnet'),
    'opt-kovan': getChainConfig('opt-kovan'),
    'palm-mainnet': getChainConfig('palm-mainnet'),
    'palm-rinkeby': getChainConfig('palm-rinkeby'),
  },
  abiExporter: {
    path: './abis',
    runOnCompile: true,
    clear: true,
    flat: false,
    only: [],
    spacing: 2,
    pretty: false,
  },
  etherscan: {
    apiKey: getEtherscanApiKey(),
  },
  docgen: {
    outputDir: 'reference',
    templates: 'templates',
  },
}

export function getHardhatConfig(userConfig: HardhatUserConfig) {
  return Object.assign({}, DefaultHardhatConfig, userConfig)
}
