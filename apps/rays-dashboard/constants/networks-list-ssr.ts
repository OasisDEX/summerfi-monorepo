import keyBy from 'lodash-es/keyBy'

import {
  type NetworkConfig,
  NetworkHexIds,
  NetworkIds,
  NetworkNames,
} from '@/constants/networks-list'
import arbitrumMainnetBadge from '@/public/img/network_icons/arbitrum_badge_mainnet.svg'
import baseMainnetBadge from '@/public/img/network_icons/base_badge_mainnet.svg'
import ethereumMainnetBadge from '@/public/img/network_icons/ethereum_badge_mainnet.svg'
import optimismMainnetBadge from '@/public/img/network_icons/optimism_badge_mainnet.svg'

const mainnetConfig: NetworkConfig = {
  name: NetworkNames.ethereumMainnet,
  hexId: NetworkHexIds.MAINNET,
  label: 'Ethereum',
  token: 'ETH',
  testnet: false,
  badge: ethereumMainnetBadge as string,
  color: '#728aee',
  id: NetworkIds.MAINNET,
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
  rpcUrl: '',
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
