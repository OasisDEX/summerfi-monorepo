import { SDKChainId } from '@summerfi/app-types'

import { clientId } from '@/helpers/client-id'

type NetworkConfigHexId = `0x${number | string}`

export enum NetworkNames {
  ethereumMainnet = 'ethereum',
  arbitrumMainnet = 'arbitrum',
  optimismMainnet = 'optimism',
  baseMainnet = 'base',
  baseGoerli = 'base_goerli',

  sonicMainnet = 'sonic',
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
  SONICMAINNET = 146,
}

enum NetworkHexIds {
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
  SONICMAINNET = '0x92',
}

type NetworkLabelType =
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
  | 'Sonic'

type NetworkConfig = {
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

  return `${window.location.origin}/earn/api/rpcGateway?network=${network}&clientId=${clientId}`
}

const mainnetRpc = getRpc(NetworkNames.ethereumMainnet)
const arbitrumMainnetRpc = getRpc(NetworkNames.arbitrumMainnet)
const optimismMainnetRpc = getRpc(NetworkNames.optimismMainnet)
const baseMainnetRpc = getRpc(NetworkNames.baseMainnet)
const baseGoerliRpc = getRpc(NetworkNames.baseGoerli)
const sonicMainnetRpc = getRpc(NetworkNames.sonicMainnet)

export const SDKChainIdToRpcGatewayMap = {
  [SDKChainId.ARBITRUM]: arbitrumMainnetRpc,
  [SDKChainId.BASE]: baseMainnetRpc,
  [SDKChainId.MAINNET]: mainnetRpc,
  [SDKChainId.OPTIMISM]: optimismMainnetRpc,
  [SDKChainId.SEPOLIA]: baseGoerliRpc, // dummy for now, not used anyway
  [SDKChainId.SONIC]: sonicMainnetRpc,
}
