import {
  type EarnProtocolDbNetwork,
  NetworkIds,
  NetworkNames,
  SDKChainId,
  SDKNetwork,
  type SDKSupportedChain,
  sdkSupportedChains,
  type SDKSupportedNetwork,
  sdkSupportedNetworks,
} from '@summerfi/app-types'
import { arbitrum, base, type Chain, mainnet, sonic } from 'viem/chains'

/**
 * Type guard to check if a chain ID is a supported SDK chain.
 * Supported chains are Arbitrum, Base, and Mainnet.
 *
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is supported, false otherwise
 */
export const isSupportedSDKChain = (
  chainId: unknown,
): chainId is SDKChainId.ARBITRUM | SDKChainId.BASE | SDKChainId.MAINNET =>
  typeof chainId === 'number' && sdkSupportedChains.includes(chainId)

/**
 * Maps SDK network identifiers to human readable network names.
 */
export const humanReadableNetworkMap: {
  readonly ARBITRUM_ONE: 'arbitrum'
  readonly BASE: 'base'
  readonly MAINNET: 'mainnet'
  readonly SONIC_MAINNET: 'sonic'
} = {
  [SDKNetwork.ArbitrumOne]: 'arbitrum',
  [SDKNetwork.Base]: 'base',
  [SDKNetwork.Mainnet]: 'mainnet',
  [SDKNetwork.SonicMainnet]: 'sonic',
} as const

/**
 * Maps chain IDs to their display labels.
 */
export const humanReadableChainToLabelMap: {
  readonly 8453: 'Base'
  readonly 42161: 'Arbitrum'
  readonly 1: 'Ethereum'
  readonly 146: 'Sonic'
} = {
  [SDKChainId.BASE]: 'Base',
  [SDKChainId.ARBITRUM]: 'Arbitrum',
  [SDKChainId.MAINNET]: 'Ethereum',
  [SDKChainId.SONIC]: 'Sonic',
} as const

/**
 * Maps human readable network names to SDK network identifiers.
 */
const sdkNetworkMap = {
  arbitrum: SDKNetwork.ArbitrumOne,
  base: SDKNetwork.Base,
  mainnet: SDKNetwork.Mainnet,
  sonic: SDKNetwork.SonicMainnet,
}

/**
 * Type representing the human readable network names.
 * Derived from the values in humanReadableNetworkMap.
 */
export type HumanReadableNetwork =
  (typeof humanReadableNetworkMap)[keyof typeof humanReadableNetworkMap]

/**
 * Type guard to check if a network is a supported SDK network.
 *
 * @param network - The network to check
 * @returns True if the network is supported, false otherwise
 */
export const isSupportedSDKNetwork = (network: unknown): network is SDKSupportedNetwork => {
  return typeof network === 'string' && network in humanReadableNetworkMap
}

/**
 * Type guard to check whether a value is a supported human network.
 * Supported human networks are: "arbitrum", "base", and "mainnet".
 *
 * @param network - The value to test.
 * @returns True if the value is a string and corresponds to a supported human network.
 */
export const isSupportedHumanNetwork = (network: unknown): network is HumanReadableNetwork => {
  return typeof network === 'string' && network.toLowerCase() in sdkNetworkMap
}

export const sdkNetworkToHumanNetworkStrict = (network: SDKNetwork): HumanReadableNetwork => {
  if (!humanReadableNetworkMap[network as SDKSupportedNetwork]) {
    throw new Error(`Unsupported network: ${network}`)
  }

  return humanReadableNetworkMap[network as SDKSupportedNetwork]
}

export const sdkNetworkToHumanNetwork = (network: SDKNetwork): string => {
  if (!humanReadableNetworkMap[network as SDKSupportedNetwork]) {
    // eslint-disable-next-line no-console
    console.error('sdkNetworkToHumanNetwork: Network needs mapping', network)

    return network
  }

  return humanReadableNetworkMap[network as SDKSupportedNetwork]
}

export const humanNetworktoSDKNetwork = (network: string): SDKNetwork => {
  if (network in humanReadableNetworkMap) {
    return network.toLowerCase() as SDKNetwork
  }
  const sdkNetwork = sdkNetworkMap[network.toLowerCase() as keyof typeof sdkNetworkMap]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!sdkNetwork) {
    // eslint-disable-next-line no-console
    console.error('humanNetworktoSDKNetwork: Network needs mapping', network)

    return network as SDKNetwork
  }

  return sdkNetworkMap[network.toLowerCase() as keyof typeof sdkNetworkMap]
}

export const chainIdToSDKNetwork = (chainId: SDKChainId): SDKNetwork => {
  if (chainId === SDKChainId.SEPOLIA || chainId === SDKChainId.OPTIMISM) {
    throw new Error('Sepolia and Optimism are not supported [chainIdToSDKNetwork]')
  }

  return {
    [SDKChainId.ARBITRUM]: SDKNetwork.ArbitrumOne,
    [SDKChainId.BASE]: SDKNetwork.Base,
    [SDKChainId.MAINNET]: SDKNetwork.Mainnet,
    [SDKChainId.SONIC]: SDKNetwork.SonicMainnet,
  }[chainId]
}

export const sdkChainIdToHumanNetwork = (chainId: SDKChainId): string => {
  const network = chainIdToSDKNetwork(chainId)

  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return sdkNetworkToHumanNetwork(network)
}

export const networkNameToSDKNetwork = (network: NetworkNames): SDKNetwork => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SDKNetwork.ArbitrumOne,
    [NetworkNames.baseMainnet.toLowerCase()]: SDKNetwork.Base,
    [NetworkNames.ethereumMainnet.toLowerCase()]: SDKNetwork.Mainnet,
    [NetworkNames.optimismMainnet.toLowerCase()]: SDKNetwork.Optimism,
    [NetworkNames.sonicMainnet.toLowerCase()]: SDKNetwork.SonicMainnet,
  }[network.toLowerCase()]
}

export const networkNameToSDKId = (network: NetworkNames): SDKChainId => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SDKChainId.ARBITRUM,
    [NetworkNames.baseMainnet.toLowerCase()]: SDKChainId.BASE,
    [NetworkNames.ethereumMainnet.toLowerCase()]: SDKChainId.MAINNET,
    [NetworkNames.optimismMainnet.toLowerCase()]: SDKChainId.OPTIMISM,
    [NetworkNames.sonicMainnet.toLowerCase()]: SDKChainId.SONIC,
  }[network.toLowerCase()]
}

export const subgraphNetworkToId = (network: SDKNetwork): NetworkIds => {
  return {
    [SDKNetwork.ArbitrumOne.toLowerCase()]: NetworkIds.ARBITRUMMAINNET,
    [SDKNetwork.Base.toLowerCase()]: NetworkIds.BASEMAINNET,
    [SDKNetwork.Mainnet.toLowerCase()]: NetworkIds.MAINNET,
    [SDKNetwork.SonicMainnet.toLowerCase()]: NetworkIds.SONICMAINNET,
  }[network.toLowerCase()]
}

export const subgraphNetworkToSDKId = (network: SDKNetwork) => {
  return {
    [SDKNetwork.ArbitrumOne.toLowerCase()]: SDKChainId.ARBITRUM,
    [SDKNetwork.Base.toLowerCase()]: SDKChainId.BASE,
    [SDKNetwork.Mainnet.toLowerCase()]: SDKChainId.MAINNET,
    [SDKNetwork.SonicMainnet.toLowerCase()]: SDKChainId.SONIC,
  }[network.toLowerCase()] as SDKSupportedChain
}

export const sdkNetworkToChain = (network: SDKNetwork): Chain => {
  if (!sdkSupportedNetworks.includes(network as SDKSupportedNetwork)) {
    throw new Error(`Unsupported network: ${network}`)
  }

  const chainMap: { [K in SDKSupportedNetwork]: Chain } = {
    [SDKNetwork.ArbitrumOne]: arbitrum,
    [SDKNetwork.Base]: base,
    [SDKNetwork.Mainnet]: mainnet,
    [SDKNetwork.SonicMainnet]: sonic,
  }

  return chainMap[network as SDKSupportedNetwork]
}

const dbNetworkToChainId: { [key in EarnProtocolDbNetwork]: SDKChainId } = {
  arbitrum: SDKChainId.ARBITRUM,
  optimism: SDKChainId.OPTIMISM,
  base: SDKChainId.BASE,
  mainnet: SDKChainId.MAINNET,
  sonic: SDKChainId.SONIC,
}

export function mapDbNetworkToChainId(network: EarnProtocolDbNetwork): SDKChainId {
  if (!dbNetworkToChainId[network]) {
    throw new Error(`No matching chainId found for network: ${network}`)
  }

  return dbNetworkToChainId[network]
}

export function mapChainIdToDbNetwork(chainId: SDKChainId): EarnProtocolDbNetwork {
  const network = Object.entries(dbNetworkToChainId).find(([_, value]) => {
    return Number(value) === Number(chainId)
  })?.[0]

  if (!network) {
    throw new Error(`No matching database network found for chainId: ${chainId}`)
  }

  return network as EarnProtocolDbNetwork
}
