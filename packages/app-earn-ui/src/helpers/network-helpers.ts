import {
  NetworkIds,
  NetworkNames,
  SDKChainId,
  SDKNetwork,
  type SDKSupportedNetworkType,
} from '@summerfi/app-types'

export const networkNameToSDKNetwork = (network: NetworkNames) => {
  return {
    [NetworkNames.arbitrumMainnet.toLowerCase()]: SDKNetwork.ArbitrumOne,
    [NetworkNames.baseMainnet.toLowerCase()]: SDKNetwork.Base,
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
  }[network.toLowerCase()] as SDKSupportedNetworkType
}
