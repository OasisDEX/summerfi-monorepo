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

const ethereumMainnetGradient = 'linear-gradient(128deg, #6580EB 23.94%, #8EA2F2 110.63%)'
const optimismMainnetGradient = 'linear-gradient(135deg, #FF0420 0%, #FF6C7D 100%)'
const arbitrumMainnetGradient = 'linear-gradient(128deg, #243145 3.74%, #4DA7F8 83.51%)'
const baseMainnetGradient = 'linear-gradient(128deg, #0052ff 3.74%, #6696ff 83.51%)'

export type NetworkConfig = {
  name: NetworkNames
  testnet: boolean
  gradient: string
}

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  testnet: false,
  gradient: ethereumMainnetGradient,
}

const goerliConfig: NetworkConfig = {
  name: NetworkNames.ethereumGoerli,
  testnet: true,
  gradient: ethereumMainnetGradient,
}

const arbitrumMainnetConfig: NetworkConfig = {
  name: NetworkNames.arbitrumMainnet,
  testnet: false,
  gradient: arbitrumMainnetGradient,
}

const arbitrumGoerliConfig: NetworkConfig = {
  name: NetworkNames.arbitrumGoerli,
  testnet: true,
  gradient: arbitrumMainnetGradient,
}

const optimismMainnetConfig: NetworkConfig = {
  name: NetworkNames.optimismMainnet,
  testnet: false,
  gradient: optimismMainnetGradient,
}

const optimismGoerliConfig: NetworkConfig = {
  name: NetworkNames.optimismGoerli,
  testnet: true,
  gradient: optimismMainnetGradient,
}

const baseMainnetConfig: NetworkConfig = {
  name: NetworkNames.baseMainnet,
  testnet: false,
  gradient: baseMainnetGradient,
}

const baseGoerliConfig: NetworkConfig = {
  name: NetworkNames.baseGoerli,
  testnet: true,
  gradient: baseMainnetGradient,
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
