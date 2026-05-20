import type { ChainId, AddressValue } from '@summerfi/sdk-common'

export type DeploymentProviderConfigPublic = {
  chainId: ChainId
  active: boolean
  contracts: {
    harborCommand: AddressValue
    admiralsQuarters: AddressValue
    configurationManager: AddressValue
    protocolAccessManager: AddressValue
    dcaStrategyManager?: AddressValue
  }
}

export type DeploymentProviderConfigInsti = {
  chainId: ChainId
  active: boolean
  contracts: {
    harborCommand: AddressValue
    admiralsQuarters: AddressValue
    configurationManager: AddressValue
    protocolAccessManager: AddressValue
  }
}
