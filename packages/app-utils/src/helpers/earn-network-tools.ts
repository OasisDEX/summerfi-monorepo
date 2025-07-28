/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  type EarnProtocolDbNetwork,
  NetworkIds,
  NetworkNames,
  SupportedNetworkIds,
  SupportedSDKNetworks,
} from '@summerfi/app-types'
import { arbitrum, base, type Chain, mainnet, optimism, sonic } from 'viem/chains'

/**
 * Type guard to check if a chain ID is a supported SDK chain.
 * Supported chains are Arbitrum, Base, and Mainnet.
 *
 * @param chainId - The chain ID to check
 * @returns True if the chain ID is supported, false otherwise
 */
export const isSupportedSDKChain = (
  chainId: unknown,
): chainId is
  | SupportedNetworkIds.ArbitrumOne
  | SupportedNetworkIds.Base
  | SupportedNetworkIds.SonicMainnet
  | SupportedNetworkIds.Optimism
  | SupportedNetworkIds.Mainnet =>
  typeof chainId === 'number' &&
  Object.values(SupportedNetworkIds)
    .filter((networkId): networkId is number => typeof networkId === 'number')
    .includes(chainId)

/**
 * Maps SDK network identifiers to human readable network names.
 */
const humanReadableNetworkMap: {
  readonly ARBITRUM_ONE: 'arbitrum'
  readonly BASE: 'base'
  readonly MAINNET: 'mainnet'
  readonly SONIC_MAINNET: 'sonic'
  readonly OPTIMISM: 'optimism'
} = {
  [SupportedSDKNetworks.ArbitrumOne]: 'arbitrum',
  [SupportedSDKNetworks.Base]: 'base',
  [SupportedSDKNetworks.Mainnet]: 'mainnet',
  [SupportedSDKNetworks.SonicMainnet]: 'sonic',
  [SupportedSDKNetworks.Optimism]: 'optimism',
} as const

/**
 * Maps chain IDs to their display labels.
 */
export const humanReadableChainToLabelMap: {
  readonly 8453: 'Base'
  readonly 42161: 'Arbitrum'
  readonly 1: 'Ethereum'
  readonly 146: 'Sonic'
  readonly 10: 'Optimism'
} = {
  [SupportedNetworkIds.Base]: 'Base',
  [SupportedNetworkIds.ArbitrumOne]: 'Arbitrum',
  [SupportedNetworkIds.Mainnet]: 'Ethereum',
  [SupportedNetworkIds.SonicMainnet]: 'Sonic',
  [SupportedNetworkIds.Optimism]: 'Optimism',
} as const

/**
 * Maps human readable network names to SDK network identifiers.
 */
const sdkNetworkMap = {
  arbitrum: SupportedSDKNetworks.ArbitrumOne,
  base: SupportedSDKNetworks.Base,
  mainnet: SupportedSDKNetworks.Mainnet,
  sonic: SupportedSDKNetworks.SonicMainnet,
}

/**
 * Type representing the human readable network names.
 * Derived from the values in humanReadableNetworkMap.
 */
export type HumanReadableNetwork =
  (typeof humanReadableNetworkMap)[keyof typeof humanReadableNetworkMap]

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

export const supportedNetworkId = (networkId: unknown): SupportedNetworkIds => {
  if (
    !Object.values(SupportedNetworkIds)
      .filter(
        (potentialNetworkId): potentialNetworkId is number =>
          typeof potentialNetworkId === 'number',
      )
      .includes(networkId as unknown as SupportedNetworkIds)
  ) {
    throw new Error(`Unsupported network ID: ${networkId}`)
  }

  return networkId as SupportedNetworkIds
}

export const supportedSDKNetwork = (network: unknown): SupportedSDKNetworks => {
  if (!Object.values(SupportedSDKNetworks).includes(network as unknown as SupportedSDKNetworks)) {
    throw new Error(`Unsupported SDK network: ${network}`)
  }

  return network as SupportedSDKNetworks
}

export const sdkNetworkToHumanNetworkStrict = (
  network: SupportedSDKNetworks,
): HumanReadableNetwork => {
  if (!humanReadableNetworkMap[network]) {
    throw new Error(`Unsupported network: ${network}`)
  }

  return humanReadableNetworkMap[network]
}

export const sdkNetworkToHumanNetwork = (network: SupportedSDKNetworks): string => {
  if (!humanReadableNetworkMap[network]) {
    // eslint-disable-next-line no-console
    console.error('sdkNetworkToHumanNetwork: Network needs mapping', network)

    return network
  }

  return humanReadableNetworkMap[network]
}

export const humanNetworktoSDKNetwork = (network: string): SupportedSDKNetworks => {
  if (network in humanReadableNetworkMap) {
    return network.toLowerCase() as SupportedSDKNetworks
  }
  const sdkNetwork = sdkNetworkMap[network.toLowerCase() as keyof typeof sdkNetworkMap]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!sdkNetwork) {
    // eslint-disable-next-line no-console
    console.error('humanNetworktoSDKNetwork: Network needs mapping', network)

    return network as SupportedSDKNetworks
  }

  return sdkNetworkMap[network.toLowerCase() as keyof typeof sdkNetworkMap]
}

export const chainIdToSDKNetwork = (chainId: SupportedNetworkIds): SupportedSDKNetworks => {
  try {
    const mappedResponse = {
      [SupportedNetworkIds.ArbitrumOne]: SupportedSDKNetworks.ArbitrumOne,
      [SupportedNetworkIds.Base]: SupportedSDKNetworks.Base,
      [SupportedNetworkIds.Mainnet]: SupportedSDKNetworks.Mainnet,
      [SupportedNetworkIds.SonicMainnet]: SupportedSDKNetworks.SonicMainnet,
      [SupportedNetworkIds.Optimism]: SupportedSDKNetworks.Optimism,
    }[chainId]

    return mappedResponse
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('chainIdToSDKNetwork: Chain ID needs mapping', chainId)

    throw new Error(`Unsupported chain ID: ${chainId}`)
  }
}

export const sdkChainIdToHumanNetwork = (chainId: SupportedNetworkIds): string => {
  const network = chainIdToSDKNetwork(chainId)

  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return sdkNetworkToHumanNetwork(network)
}

export const networkNameToSDKNetwork = (network: NetworkNames): SupportedSDKNetworks => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SupportedSDKNetworks.ArbitrumOne,
    [NetworkNames.baseMainnet.toLowerCase()]: SupportedSDKNetworks.Base,
    [NetworkNames.ethereumMainnet.toLowerCase()]: SupportedSDKNetworks.Mainnet,
    [NetworkNames.sonicMainnet.toLowerCase()]: SupportedSDKNetworks.SonicMainnet,
    [NetworkNames.optimismMainnet.toLowerCase()]: SupportedSDKNetworks.Optimism,
  }[network.toLowerCase()]
}

export const networkNameToSDKId = (network: NetworkNames): SupportedNetworkIds => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SupportedNetworkIds.ArbitrumOne,
    [NetworkNames.baseMainnet.toLowerCase()]: SupportedNetworkIds.Base,
    [NetworkNames.ethereumMainnet.toLowerCase()]: SupportedNetworkIds.Mainnet,
    [NetworkNames.sonicMainnet.toLowerCase()]: SupportedNetworkIds.SonicMainnet,
    [NetworkNames.optimismMainnet.toLowerCase()]: SupportedNetworkIds.Optimism,
  }[network.toLowerCase()]
}

export const subgraphNetworkToId = (network: SupportedSDKNetworks): NetworkIds => {
  return {
    [SupportedSDKNetworks.ArbitrumOne.toLowerCase()]: NetworkIds.ARBITRUMMAINNET,
    [SupportedSDKNetworks.Base.toLowerCase()]: NetworkIds.BASEMAINNET,
    [SupportedSDKNetworks.Mainnet.toLowerCase()]: NetworkIds.MAINNET,
    [SupportedSDKNetworks.SonicMainnet.toLowerCase()]: NetworkIds.SONICMAINNET,
    [SupportedSDKNetworks.Optimism.toLowerCase()]: NetworkIds.OPTIMISMMAINNET,
  }[network.toLowerCase()]
}

export const subgraphNetworkToSDKId = (network: SupportedSDKNetworks): SupportedNetworkIds => {
  return {
    [SupportedSDKNetworks.ArbitrumOne.toLowerCase()]: SupportedNetworkIds.ArbitrumOne,
    [SupportedSDKNetworks.Base.toLowerCase()]: SupportedNetworkIds.Base,
    [SupportedSDKNetworks.Mainnet.toLowerCase()]: SupportedNetworkIds.Mainnet,
    [SupportedSDKNetworks.SonicMainnet.toLowerCase()]: SupportedNetworkIds.SonicMainnet,
    [SupportedSDKNetworks.Optimism.toLowerCase()]: SupportedNetworkIds.Optimism,
  }[network.toLowerCase()]
}

export const sdkNetworkToChain = (network: SupportedSDKNetworks): Chain => {
  if (!Object.values(SupportedSDKNetworks).includes(network)) {
    throw new Error(`Unsupported network: ${network}`)
  }

  const chainMap: { [K in SupportedSDKNetworks]: Chain } = {
    [SupportedSDKNetworks.ArbitrumOne]: arbitrum,
    [SupportedSDKNetworks.Base]: base,
    [SupportedSDKNetworks.Mainnet]: mainnet,
    [SupportedSDKNetworks.SonicMainnet]: sonic,
    [SupportedSDKNetworks.Optimism]: optimism,
  }

  return chainMap[network]
}

const dbNetworkToChainId: {
  [key: string]: SupportedNetworkIds
} = {
  arbitrum: SupportedNetworkIds.ArbitrumOne,
  base: SupportedNetworkIds.Base,
  mainnet: SupportedNetworkIds.Mainnet,
  sonic: SupportedNetworkIds.SonicMainnet,
}

export function mapDbNetworkToChainId(network: EarnProtocolDbNetwork): SupportedNetworkIds {
  if (!dbNetworkToChainId[network]) {
    throw new Error(`No matching chainId found for network: ${network}`)
  }

  return dbNetworkToChainId[network]
}

export function mapChainIdToDbNetwork(chainId: SupportedNetworkIds): EarnProtocolDbNetwork {
  const network = Object.entries(dbNetworkToChainId).find(([_, value]) => {
    return Number(value) === Number(chainId)
  })?.[0]

  if (!network) {
    throw new Error(`No matching database network found for chainId: ${chainId}`)
  }

  return network as EarnProtocolDbNetwork
}
