import { type IconNamesList, SDKNetwork } from '@summerfi/app-types'

export const networkIconByNetworkName: Partial<{ [key in SDKNetwork]: IconNamesList }> = {
  [SDKNetwork.ArbitrumOne]: 'earn_network_arbitrum',
  [SDKNetwork.Base]: 'earn_network_base',
  // [SDKNetwork.Blast]: 'earn_network_blast',
  [SDKNetwork.Mainnet]: 'earn_network_ethereum',
  [SDKNetwork.Optimism]: 'earn_network_optimism',
}
