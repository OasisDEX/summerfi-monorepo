import { ChainInfo } from './Chain'

/**
 * @type ChainFamily
 * @param {ChainInfo} [key: string] - The name of the network
 * @param {ChainInfo} [value: NetworkId] - The chain id of the network
 *
 * @description A map of network names to network IDs
 */
export type ChainFamily = {
  [key: string]: ChainInfo
}

/**
 * @enum ChainFamilyName
 * @description Indicates the name of the network
 */
export enum ChainFamilyName {
  Ethereum,
  Arbitrum,
  Optimism,
  Base,
}

// Definition of the different network families
const EthereumFamily: ChainFamily = {
  Mainnet: {
    chainId: 1,
    name: 'mainnet',
  },
  Goerli: {
    chainId: 5,
    name: 'goerli',
  },
}

const ArbitrumFamily: ChainFamily = {
  ArbitrumOne: {
    chainId: 42161,
    name: 'arbitrum-one',
  },
}

const OptimismFamily: ChainFamily = {
  Optimism: {
    chainId: 10,
    name: 'optimism',
  },
}

const BaseFamily: ChainFamily = {
  Mainnet: {
    chainId: 8453,
    name: 'mainnet',
  },
}

/**
 * @type NetworkFamilies
 * @description A map of network family names to network families. It can be used to
 *              retrieve the NetworkId of a network family + network combination
 */
export const ChainFamilies: Record<ChainFamilyName, ChainFamily> = {
  [ChainFamilyName.Ethereum]: EthereumFamily,
  [ChainFamilyName.Arbitrum]: ArbitrumFamily,
  [ChainFamilyName.Optimism]: OptimismFamily,
  [ChainFamilyName.Base]: BaseFamily,
}
