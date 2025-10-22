import type { ChainId, AddressValue } from '@summerfi/sdk-common'

export type DeploymentProviderConfig = {
  chainId: ChainId
  active: boolean
  contracts: {
    harborCommand: AddressValue
    admiralsQuarters: AddressValue
    configurationManager: AddressValue
    protocolAccessManager: AddressValue
  }
}
