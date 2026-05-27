import { type GetVaultsApyResponse, type SDKVaultishType } from '@summerfi/app-types'
import { subgraphNetworkToId, supportedSDKNetwork } from '@summerfi/app-utils'

export const getVaultApySelector = (vault: SDKVaultishType) =>
  `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}` as keyof GetVaultsApyResponse
