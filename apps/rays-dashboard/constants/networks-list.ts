import { keyBy } from 'lodash'

import arbitrumMainnetBadge from '@/public/img/network_icons/arbitrum_badge_mainnet.svg'
import baseMainnetBadge from '@/public/img/network_icons/base_badge_mainnet.svg'
import ethereumMainnetBadge from '@/public/img/network_icons/ethereum_badge_mainnet.svg'
import optimismMainnetBadge from '@/public/img/network_icons/optimism_badge_mainnet.svg'

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
  badge: string
}

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  testnet: false,
  gradient: ethereumMainnetGradient,
  badge: ethereumMainnetBadge as string,
}

const goerliConfig: NetworkConfig = {
  name: NetworkNames.ethereumGoerli,
  testnet: true,
  gradient: ethereumMainnetGradient,
  badge: ethereumMainnetBadge as string,
}

const arbitrumMainnetConfig: NetworkConfig = {
  name: NetworkNames.arbitrumMainnet,
  testnet: false,
  gradient: arbitrumMainnetGradient,
  badge: arbitrumMainnetBadge as string,
}

const arbitrumGoerliConfig: NetworkConfig = {
  name: NetworkNames.arbitrumGoerli,
  testnet: true,
  gradient: arbitrumMainnetGradient,
  badge: arbitrumMainnetBadge as string,
}

const optimismMainnetConfig: NetworkConfig = {
  name: NetworkNames.optimismMainnet,
  testnet: false,
  gradient: optimismMainnetGradient,
  badge: optimismMainnetBadge as string,
}

const optimismGoerliConfig: NetworkConfig = {
  name: NetworkNames.optimismGoerli,
  testnet: true,
  gradient: optimismMainnetGradient,
  badge: optimismMainnetBadge as string,
}

const baseMainnetConfig: NetworkConfig = {
  name: NetworkNames.baseMainnet,
  testnet: false,
  gradient: baseMainnetGradient,
  badge: baseMainnetBadge as string,
}

const baseGoerliConfig: NetworkConfig = {
  name: NetworkNames.baseGoerli,
  testnet: true,
  gradient: baseMainnetGradient,
  badge: baseMainnetBadge as string,
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
