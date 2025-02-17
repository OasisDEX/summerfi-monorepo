import { arbitrum, base, mainnet } from '@account-kit/infra'
import {
  NetworkIds,
  NetworkNames,
  SDKChainId,
  SDKNetwork,
  type SDKSupportedChain,
  sdkSupportedChains,
  type SDKSupportedNetwork,
  sdkSupportedNetworks,
} from '@summerfi/app-types'
import { type Chain } from 'viem/chains'

export const isSupportedSDKChain = (
  chainId: unknown,
): chainId is SDKChainId.ARBITRUM | SDKChainId.BASE | SDKChainId.MAINNET =>
  typeof chainId === 'number' && sdkSupportedChains.includes(chainId)

const humanReadableNetworkMap = {
  [SDKNetwork.ArbitrumOne]: 'arbitrum',
  [SDKNetwork.Base]: 'base',
  [SDKNetwork.Mainnet]: 'mainnet',
}

const sdkNetworkMap = {
  arbitrum: SDKNetwork.ArbitrumOne,
  base: SDKNetwork.Base,
  mainnet: SDKNetwork.Mainnet,
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

export const chainIdToSDKNetwork = (chainId: SDKChainId) => {
  if (chainId === SDKChainId.SEPOLIA || chainId === SDKChainId.OPTIMISM) {
    throw new Error('Sepolia is not supported [chainIdToSDKNetwork]')
  }

  return {
    [SDKChainId.ARBITRUM]: SDKNetwork.ArbitrumOne,
    [SDKChainId.BASE]: SDKNetwork.Base,
    [SDKChainId.MAINNET]: SDKNetwork.Mainnet,
  }[chainId]
}

export const networkNameToSDKNetwork = (network: NetworkNames) => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SDKNetwork.ArbitrumOne,
    [NetworkNames.baseMainnet.toLowerCase()]: SDKNetwork.Base,
    [NetworkNames.ethereumMainnet.toLowerCase()]: SDKNetwork.Mainnet,
    [NetworkNames.optimismMainnet.toLowerCase()]: SDKNetwork.Optimism,
  }[network.toLowerCase()]
}

export const subgraphNetworkToId = (network: SDKNetwork) => {
  return {
    [SDKNetwork.ArbitrumOne.toLowerCase()]: NetworkIds.ARBITRUMMAINNET,
    [SDKNetwork.Base.toLowerCase()]: NetworkIds.BASEMAINNET,
    [SDKNetwork.Mainnet.toLowerCase()]: NetworkIds.MAINNET,
  }[network.toLowerCase()]
}

export const subgraphNetworkToSDKId = (network: SDKNetwork) => {
  return {
    [SDKNetwork.ArbitrumOne.toLowerCase()]: SDKChainId.ARBITRUM,
    [SDKNetwork.Base.toLowerCase()]: SDKChainId.BASE,
    [SDKNetwork.Mainnet.toLowerCase()]: SDKChainId.MAINNET,
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
  }

  return chainMap[network as SDKSupportedNetwork]
}

/**
 * Type guard to check whether a value is a supported human network.
 * Supported human networks are: "arbitrum", "base", and "mainnet".
 *
 * @param network - The value to test.
 * @returns True if the value is a string and corresponds to a supported human network.
 */
export const isSupportedHumanNetwork = (
  network: unknown,
): network is 'arbitrum' | 'base' | 'mainnet' => {
  return typeof network === 'string' && network.toLowerCase() in sdkNetworkMap
}
