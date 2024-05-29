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

export type NetworkConfig = {
  name: NetworkNames
  testnet: boolean
  badge: string
}

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  testnet: false,
  badge: ethereumMainnetBadge as string,
}

const goerliConfig: NetworkConfig = {
  name: NetworkNames.ethereumGoerli,
  testnet: true,
  badge: ethereumMainnetBadge as string,
}

const arbitrumMainnetConfig: NetworkConfig = {
  name: NetworkNames.arbitrumMainnet,
  testnet: false,
  badge: arbitrumMainnetBadge as string,
}

const arbitrumGoerliConfig: NetworkConfig = {
  name: NetworkNames.arbitrumGoerli,
  testnet: true,
  badge: arbitrumMainnetBadge as string,
}

const optimismMainnetConfig: NetworkConfig = {
  name: NetworkNames.optimismMainnet,
  testnet: false,
  badge: optimismMainnetBadge as string,
}

const optimismGoerliConfig: NetworkConfig = {
  name: NetworkNames.optimismGoerli,
  testnet: true,
  badge: optimismMainnetBadge as string,
}

const baseMainnetConfig: NetworkConfig = {
  name: NetworkNames.baseMainnet,
  testnet: false,
  badge: baseMainnetBadge as string,
}

const baseGoerliConfig: NetworkConfig = {
  name: NetworkNames.baseGoerli,
  testnet: true,
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
