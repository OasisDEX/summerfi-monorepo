import { type IconNamesList, NetworkNames } from '@summerfi/app-types'

export const networkIconByNetworkName: { [key in NetworkNames]: IconNamesList } = {
  [NetworkNames.ethereumMainnet]: 'network_ethereum',
  [NetworkNames.ethereumGoerli]: 'network_ethereum',

  [NetworkNames.arbitrumMainnet]: 'network_arbitrum',
  [NetworkNames.arbitrumGoerli]: 'network_arbitrum',

  [NetworkNames.optimismMainnet]: 'network_optimism',
  [NetworkNames.optimismGoerli]: 'network_optimism',

  [NetworkNames.baseMainnet]: 'network_base',
  [NetworkNames.baseGoerli]: 'network_base',

  // todo
  [NetworkNames.polygonMainnet]: 'network_arbitrum',
  [NetworkNames.polygonMumbai]: 'network_arbitrum',
}
