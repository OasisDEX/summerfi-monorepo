import type { ChainId, AddressValue } from '@summerfi/sdk-common/index'

export type DeploymentProviderConfig = {
  chainId: ChainId
  active: boolean
  contracts: {
    harborCommand: Record<ChainId, AddressValue>
    admiralsQuarters: Record<ChainId, AddressValue>
    configurationManager: Record<ChainId, AddressValue>
    protocolAccessManager: Record<ChainId, AddressValue>
  }
}
