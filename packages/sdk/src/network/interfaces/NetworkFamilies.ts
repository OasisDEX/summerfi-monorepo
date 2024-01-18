import { NetworkId } from './Network'

/**
 * @type NetworkFamily
 * @param {NetworkId} [key: string] - The name of the network
 * @param {NetworkId} [value: NetworkId] - The chain id of the network
 *
 * @description A map of network names to network IDs
 */
export type NetworkFamily = {
  [key: string]: NetworkId
}

/**
 * @enum NetworkFamilyName
 * @description Indicates the name of the network
 */
export enum NetworkFamilyName {
  Ethereum,
  Arbitrum,
  Optimism,
  Base,
}

// Definition of the different network families
const EthereumFamily: NetworkFamily = {
  Mainnet: {
    chainId: 1,
    name: 'mainnet',
  },
  Goerli: {
    chainId: 5,
    name: 'goerli',
  },
}

const ArbitrumFamily: NetworkFamily = {
  ArbitrumOne: {
    chainId: 42161,
    name: 'arbitrum-one',
  },
}

const OptimismFamily: NetworkFamily = {
  Optimism: {
    chainId: 10,
    name: 'optimism',
  },
}

const BaseFamily: NetworkFamily = {
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
export const NetworkFamilies: {
  [key in NetworkFamilyName]: NetworkFamily
} = {
  [NetworkFamilyName.Ethereum]: EthereumFamily,
  [NetworkFamilyName.Arbitrum]: ArbitrumFamily,
  [NetworkFamilyName.Optimism]: OptimismFamily,
  [NetworkFamilyName.Base]: BaseFamily,
}
