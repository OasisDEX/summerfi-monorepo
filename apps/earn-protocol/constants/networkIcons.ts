import { type IconNamesList, SDKNetwork } from '@summerfi/app-types'

export const networkIconByNetworkName: Partial<{ [key in SDKNetwork]: IconNamesList }> = {
  [SDKNetwork.ArbitrumOne]: 'network_arbitrum',
  [SDKNetwork.Base]: 'network_base',
}
