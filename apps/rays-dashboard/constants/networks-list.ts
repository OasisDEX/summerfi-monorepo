import { keyBy } from 'lodash'

export enum NetworkNames {
  ethereumMainnet = 'ethereum',
  ethereumGoerli = 'ethereum_goerli',

  arbitrumMainnet = 'arbitrum',
  arbitrumGoerli = 'arbitrum_goerli',

  polygonMainnet = 'polygon',
  polygonMumbai = 'polygon_mumbai',

  optimismMainnet = 'optimism',
  optimismGoerli = 'optimism_goerli',

  baseMainnet = 'base',
  baseGoerli = 'base_goerli',
}

export type NetworkConfig = {
  name: NetworkNames
  testnet: boolean
}

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  testnet: false,
}

const goerliConfig: NetworkConfig = {
  name: NetworkNames.ethereumGoerli,
  testnet: true,
}

const arbitrumMainnetConfig: NetworkConfig = {
  name: NetworkNames.arbitrumMainnet,
  testnet: false,
}

const arbitrumGoerliConfig: NetworkConfig = {
  name: NetworkNames.arbitrumGoerli,
  testnet: true,
}

const optimismMainnetConfig: NetworkConfig = {
  name: NetworkNames.optimismMainnet,
  testnet: false,
}

const optimismGoerliConfig: NetworkConfig = {
  name: NetworkNames.optimismGoerli,
  testnet: true,
}

const baseMainnetConfig: NetworkConfig = {
  name: NetworkNames.baseMainnet,
  testnet: false,
}

const baseGoerliConfig: NetworkConfig = {
  name: NetworkNames.baseGoerli,
  testnet: true,
}

export const mainnetNetworks = [mainnetConfig, goerliConfig]

export const L2Networks = [
  arbitrumMainnetConfig,
  arbitrumGoerliConfig,
  optimismMainnetConfig,
  optimismGoerliConfig,
  baseMainnetConfig,
  baseGoerliConfig,
]

export const networksList = [...mainnetNetworks, ...L2Networks]
export const networksByName = keyBy(networksList, 'name')
