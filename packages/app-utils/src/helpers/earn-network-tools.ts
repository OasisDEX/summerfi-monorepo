import {
  NetworkIds,
  NetworkNames,
  SDKChainId,
  SDKNetwork,
  type SDKSupportedChain,
  sdkSupportedChains,
  type SDKSupportedNetwork,
} from '@summerfi/app-types'

export const isSupportedSDKChain = (
  chainId: unknown,
): chainId is SDKChainId.ARBITRUM | SDKChainId.BASE =>
  typeof chainId === 'number' && sdkSupportedChains.includes(chainId)

const humanReadableNetworkMap = {
  [SDKNetwork.ArbitrumOne]: 'arbitrum',
  [SDKNetwork.Base]: 'base',
}

const sdkNetworkMap = {
  arbitrum: SDKNetwork.ArbitrumOne,
  base: SDKNetwork.Base,
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
  }[network.toLowerCase()]
}

export const subgraphNetworkToSDKId = (network: SDKNetwork) => {
  return {
    [SDKNetwork.ArbitrumOne.toLowerCase()]: SDKChainId.ARBITRUM,
    [SDKNetwork.Base.toLowerCase()]: SDKChainId.BASE,
  }[network.toLowerCase()] as SDKSupportedChain
}
