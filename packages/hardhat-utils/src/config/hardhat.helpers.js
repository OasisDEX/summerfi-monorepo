"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherscanApiKey = exports.getChainConfig = exports.getLocalhostChainConfig = exports.getHardhatChainConfig = exports.accounts = exports.Networks = exports.EndpointURLs = exports.Gas = exports.GasPrice = exports.ChainIds = exports.EndpointProvider = void 0;
var EndpointProvider;
(function (EndpointProvider) {
    EndpointProvider["infura"] = "infura";
    EndpointProvider["alchemy"] = "alchemy";
})(EndpointProvider = exports.EndpointProvider || (exports.EndpointProvider = {}));
exports.ChainIds = {
    goerli: 5,
    localhost: 31337,
    hardhat: 31337,
    mainnet: 1,
    sepolia: 11155111,
    'arb-rinkeby': 421611,
    'arb-mainnet': 42161,
    'ply-mainnet': 137,
    'ply-mumbai': 80001,
    'opt-mainnet': 10,
    'opt-kovan': 69,
    'palm-mainnet': 11297108109,
    'palm-rinkeby': 11297108099,
};
exports.GasPrice = {
    goerli: 'auto',
    localhost: 'auto',
    hardhat: 'auto',
    mainnet: 'auto',
    sepolia: 'auto',
    'arb-rinkeby': 'auto',
    'arb-mainnet': 'auto',
    'ply-mainnet': 'auto',
    'ply-mumbai': 'auto',
    'opt-mainnet': 'auto',
    'opt-kovan': 'auto',
    'palm-mainnet': 'auto',
    'palm-rinkeby': 'auto',
};
exports.Gas = {
    goerli: 'auto',
    localhost: 'auto',
    hardhat: 'auto',
    mainnet: 'auto',
    sepolia: 'auto',
    'arb-rinkeby': 1287983320,
    'arb-mainnet': 'auto',
    'ply-mainnet': 'auto',
    'ply-mumbai': 'auto',
    'opt-mainnet': 'auto',
    'opt-kovan': 'auto',
    'palm-mainnet': 'auto',
    'palm-rinkeby': 'auto',
};
exports.EndpointURLs = {
    infura: {
        goerli: 'https://goerli.infura.io/v3/',
        localhost: 'http://127.0.0.1:8545',
        hardhat: 'https://mainnet.infura.io/v3/',
        mainnet: 'https://mainnet.infura.io/v3/',
        sepolia: 'https://sepolia.infura.io/v3/',
        'arb-mainnet': 'https://arbitrum-mainnet.infura.io/v3/',
        'arb-rinkeby': 'https://arbitrum-rinkeby.infura.io/v3/',
        'ply-mainnet': 'https://polygon-mainnet.infura.io/v3/',
        'ply-mumbai': 'https://polygon-mumbai.infura.io/v3/',
        'opt-mainnet': 'https://optimism-mainnet.infura.io/v3/',
        'opt-kovan': 'https://optimism-kovan.infura.io/v3/',
        'palm-mainnet': 'https://palm-mainnet.infura.io/v3/',
        'palm-rinkeby': 'https://palm-rinkeby.infura.io/v3/',
    },
    alchemy: {
        goerli: 'https://eth-goerli.g.alchemy.com/v2/',
        localhost: 'http://127.0.0.1:8545',
        hardhat: 'https://eth-mainnet.g.alchemy.com/v2/',
        mainnet: 'https://eth-mainnet.g.alchemy.com/v2/',
        sepolia: 'https://eth-sepolia.g.alchemy.com/v2/',
        'arb-mainnet': 'https://arb-mainnet.g.alchemy.com/v2/',
        'arb-rinkeby': 'https://arb-rinkeby.g.alchemy.com/v2/',
        'ply-mainnet': 'https://polygon-mainnet.g.alchemy.com/v2/',
        'ply-mumbai': 'https://polygon-mumbai.g.alchemy.com/v2/',
        'opt-mainnet': 'https://optimism-mainnet.g.alchemy.com/v2/',
        'opt-kovan': 'https://optimism-kovan.g.alchemy.com/v2/',
        'palm-mainnet': '',
        'palm-rinkeby': '',
    },
};
exports.Networks = Object.keys(exports.ChainIds);
// Ensure that we have all the environment variables we need.
if (process.env.DEPLOYER_MNEMONIC === undefined && process.env.DEPLOYER_PRIVATE_KEY === undefined) {
    throw new Error('Please set your DEPLOYER_MNEMONIC or DEPLOYER_PRIVATE_KEY in a .env file');
}
exports.accounts = process.env.DEPLOYER_MNEMONIC
    ? {
        mnemonic: process.env.DEPLOYER_MNEMONIC,
        path: "m/44'/60'/0'/0/",
        initialIndex: 0,
        count: 20,
    }
    : [process.env.DEPLOYER_PRIVATE_KEY];
const endpointProvider = process.env.RPC_ENDPOINT_PROVIDER != null ? process.env.RPC_ENDPOINT_PROVIDER : '';
if (endpointProvider !== 'infura' && endpointProvider !== 'alchemy') {
    throw new Error('Please set your RPC_ENDPOINT_PROVIDER to a valid value in a .env file');
}
let endpointApiKey;
if (endpointProvider === 'infura') {
    if (!process.env.INFURA_ENDPOINT_API_KEY) {
        throw new Error('Please set your INFURA_ENDPOINT_API_KEY in a .env file');
    }
    endpointApiKey = process.env.INFURA_ENDPOINT_API_KEY;
}
if (endpointProvider === 'alchemy') {
    if (!process.env.ALCHEMY_ENDPOINT_API_KEY) {
        throw new Error('Please set your ALCHEMY_ENDPOINT_API_KEY in a .env file');
    }
    endpointApiKey = process.env.ALCHEMY_ENDPOINT_API_KEY;
}
const configMaxGas = Number(process.env.CONTRACTS_DEPLOYMENT_MAX_GAS);
const configGasPrice = Number(process.env.CONTRACTS_DEPLOYMENT_GAS_PRICE);
function getHardhatChainConfig() {
    return {
        accounts: {
            mnemonic: 'test test test test test test test test test test test junk',
            path: "m/44'/60'/0'/0/",
            initialIndex: 0,
            count: 20,
        },
        chainId: exports.ChainIds.hardhat,
    };
}
exports.getHardhatChainConfig = getHardhatChainConfig;
function getLocalhostChainConfig() {
    return {
        url: 'http://127.0.0.1:8545',
        accounts: exports.accounts,
    };
}
exports.getLocalhostChainConfig = getLocalhostChainConfig;
function getChainConfig(network) {
    const provider = endpointProvider;
    const url = exports.EndpointURLs[provider][network] + endpointApiKey;
    return {
        accounts: exports.accounts,
        chainId: exports.ChainIds[network],
        gas: configMaxGas || exports.Gas[network] || 'auto',
        gasPrice: configGasPrice || exports.GasPrice[network] || 'auto',
        url,
    };
}
exports.getChainConfig = getChainConfig;
function getEtherscanApiKey() {
    if (!process.env.ETHERSCAN_API_KEY) {
        return '';
    }
    try {
        return JSON.parse(process.env.ETHERSCAN_API_KEY);
    }
    catch (e) {
        return process.env.ETHERSCAN_API_KEY;
    }
}
exports.getEtherscanApiKey = getEtherscanApiKey;
