"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHardhatConfig = exports.DefaultHardhatConfig = void 0;
require("@nomicfoundation/hardhat-toolbox-viem");
require("hardhat-abi-exporter");
require("solidity-docgen");
const hardhat_helpers_1 = require("./hardhat.helpers");
exports.DefaultHardhatConfig = {
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
        localhost: (0, hardhat_helpers_1.getLocalhostChainConfig)(),
        hardhat: (0, hardhat_helpers_1.getHardhatChainConfig)(),
        goerli: (0, hardhat_helpers_1.getChainConfig)('goerli'),
        sepolia: (0, hardhat_helpers_1.getChainConfig)('sepolia'),
        'arb-mainnet': (0, hardhat_helpers_1.getChainConfig)('arb-mainnet'),
        'arb-rinkeby': (0, hardhat_helpers_1.getChainConfig)('arb-rinkeby'),
        'ply-mainnet': (0, hardhat_helpers_1.getChainConfig)('ply-mainnet'),
        'ply-mumbai': (0, hardhat_helpers_1.getChainConfig)('ply-mumbai'),
        'opt-mainnet': (0, hardhat_helpers_1.getChainConfig)('opt-mainnet'),
        'opt-kovan': (0, hardhat_helpers_1.getChainConfig)('opt-kovan'),
        'palm-mainnet': (0, hardhat_helpers_1.getChainConfig)('palm-mainnet'),
        'palm-rinkeby': (0, hardhat_helpers_1.getChainConfig)('palm-rinkeby'),
    },
    abiExporter: {
        path: './src/abis',
        runOnCompile: true,
        clear: true,
        flat: false,
        only: [],
        spacing: 2,
        pretty: false,
    },
    etherscan: {
        apiKey: (0, hardhat_helpers_1.getEtherscanApiKey)(),
    },
    docgen: {
        outputDir: 'reference',
        templates: 'templates',
    },
};
function getHardhatConfig(userConfig) {
    return Object.assign({}, exports.DefaultHardhatConfig, userConfig);
}
exports.getHardhatConfig = getHardhatConfig;
