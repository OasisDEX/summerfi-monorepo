import keyBy from 'lodash-es/keyBy'

import { clientId } from '@/helpers/client-id'
import arbitrumMainnetBadge from '@/public/img/network_icons/arbitrum_badge_mainnet.svg'
import baseMainnetBadge from '@/public/img/network_icons/base_badge_mainnet.svg'
import ethereumMainnetBadge from '@/public/img/network_icons/ethereum_badge_mainnet.svg'
import optimismMainnetBadge from '@/public/img/network_icons/optimism_badge_mainnet.svg'

export type NetworkConfigHexId = `0x${number | string}`

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

export enum NetworkIds {
  MAINNET = 1,
  GOERLI = 5,
  HARDHAT = 2137,
  ARBITRUMMAINNET = 42161,
  ARBITRUMGOERLI = 421613,
  POLYGONMAINNET = 137,
  POLYGONMUMBAI = 80001,
  OPTIMISMMAINNET = 10,
  OPTIMISMGOERLI = 420,
  BASEMAINNET = 8453,
  BASEGOERLI = 84531,
  EMPTYNET = 0,
}

export enum NetworkHexIds {
  MAINNET = '0x1',
  GOERLI = '0x5',
  DEFAULTFORK = '0x859',
  ARBITRUMMAINNET = '0xa4b1',
  ARBITRUMGOERLI = '0x66eed',
  POLYGONMAINNET = '0x89',
  POLYGONMUMBAI = '0x13881',
  OPTIMISMMAINNET = '0xa',
  OPTIMISMGOERLI = '0x1a4',
  BASEMAINNET = '0x2105',
  BASEGOERLI = '0x14a33',
  EMPTYNET = '0x0',
}

export type NetworkLabelType =
  | 'Ethereum'
  | 'Ethereum Goerli'
  | 'Arbitrum'
  | 'Arbitrum Goerli'
  | 'Polygon'
  | 'Polygon Mumbai'
  | 'Optimism'
  | 'Optimism Goerli'
  | 'Base'
  | 'Base Goerli'

export type NetworkConfig = {
  name: NetworkNames
  testnet: boolean
  badge: string
  hexId: NetworkConfigHexId
  label: NetworkLabelType
  token: string
  color: `#${number | string}`
  id: NetworkIds
  rpcUrl: string
}

function getRpc(network: NetworkNames): string {
  if (typeof window === 'undefined') {
    return ''
  }

  // for local testing
  const resolvedOrigin = window.location.origin.replace('3001', '3000')

  return `${resolvedOrigin}/api/rpcGateway?network=${network}&clientId=${clientId}`
}

export const mainnetRpc = getRpc(NetworkNames.ethereumMainnet)
export const goerliRpc = getRpc(NetworkNames.ethereumGoerli)
export const arbitrumMainnetRpc = getRpc(NetworkNames.arbitrumMainnet)
export const arbitrumGoerliRpc = getRpc(NetworkNames.arbitrumGoerli)
export const polygonMainnetRpc = getRpc(NetworkNames.polygonMainnet)
export const polygonMumbaiRpc = getRpc(NetworkNames.polygonMumbai)
export const optimismMainnetRpc = getRpc(NetworkNames.optimismMainnet)
export const optimismGoerliRpc = getRpc(NetworkNames.optimismGoerli)
export const baseMainnetRpc = getRpc(NetworkNames.baseMainnet)
export const baseGoerliRpc = getRpc(NetworkNames.baseGoerli)

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  hexId: NetworkHexIds.MAINNET,
  label: 'Ethereum',
  token: 'ETH',
  testnet: false,
  badge: ethereumMainnetBadge as string,
  color: '#728aee',
  id: NetworkIds.MAINNET,
  rpcUrl: mainnetRpc,
}

const goerliConfig: NetworkConfig = {
  name: NetworkNames.ethereumGoerli,
  hexId: NetworkHexIds.GOERLI,
  label: 'Ethereum Goerli',
  token: 'GoerliETH',
  testnet: true,
  badge: ethereumMainnetBadge as string,
  color: '#728aee',
  id: NetworkIds.GOERLI,
  rpcUrl: goerliRpc,
}

const arbitrumMainnetConfig: NetworkConfig = {
  name: NetworkNames.arbitrumMainnet,
  hexId: NetworkHexIds.ARBITRUMMAINNET,
  label: 'Arbitrum',
  token: 'ETH',
  testnet: false,
  badge: arbitrumMainnetBadge as string,
  color: '#28a0f0',
  id: NetworkIds.ARBITRUMMAINNET,
  rpcUrl: arbitrumMainnetRpc,
}

const arbitrumGoerliConfig: NetworkConfig = {
  name: NetworkNames.arbitrumGoerli,
  hexId: NetworkHexIds.ARBITRUMGOERLI,
  label: 'Arbitrum Goerli',
  token: 'AGOR',
  testnet: true,
  badge: arbitrumMainnetBadge as string,
  color: '#28a0f0',
  id: NetworkIds.ARBITRUMGOERLI,
  rpcUrl: arbitrumGoerliRpc,
}

const optimismMainnetConfig: NetworkConfig = {
  name: NetworkNames.optimismMainnet,
  hexId: NetworkHexIds.OPTIMISMMAINNET,
  label: 'Optimism',
  token: 'ETH',
  testnet: false,
  badge: optimismMainnetBadge as string,
  color: '#ff3f49',
  id: NetworkIds.OPTIMISMMAINNET,
  rpcUrl: optimismMainnetRpc,
}

const optimismGoerliConfig: NetworkConfig = {
  name: NetworkNames.optimismGoerli,
  hexId: NetworkHexIds.OPTIMISMGOERLI,
  label: 'Optimism Goerli',
  token: 'ETH',
  testnet: true,
  badge: optimismMainnetBadge as string,
  color: '#ff3f49',
  id: NetworkIds.OPTIMISMGOERLI,
  rpcUrl: optimismGoerliRpc,
}

const baseMainnetConfig: NetworkConfig = {
  name: NetworkNames.baseMainnet,
  hexId: NetworkHexIds.BASEMAINNET,
  label: 'Base',
  token: 'ETH',
  testnet: false,
  badge: baseMainnetBadge as string,
  color: '#0052ff',
  id: NetworkIds.BASEMAINNET,
  rpcUrl: baseMainnetRpc,
}

const baseGoerliConfig: NetworkConfig = {
  name: NetworkNames.baseGoerli,
  hexId: NetworkHexIds.BASEGOERLI,
  label: 'Base Goerli',
  token: 'ETH',
  testnet: true,
  badge: baseMainnetBadge as string,
  color: '#0052ff',
  id: NetworkIds.BASEGOERLI,
  rpcUrl: baseGoerliRpc,
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
export const networksByName: { [key: string]: NetworkConfig } = keyBy(networksList, 'name')
export const networksByHexId: { [key: string]: NetworkConfig } = keyBy(networksList, 'hexId')
export const networksByChainId: { [key: string]: NetworkConfig } = keyBy(networksList, 'id')
