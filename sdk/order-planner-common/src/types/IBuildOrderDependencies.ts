import { IAddressBookManager } from '@summerfi/address-book-common'
import { IArmadaManager } from '@summerfi/armada-protocol-common'
import { IContractsProvider } from '@summerfi/contracts-provider-common'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { ISwapManager } from '@summerfi/swap-common'

/**
 * Type for the dependencies of a build order request
 */
export interface IBuildOrderDependencies {
  armadaManager: IArmadaManager
  actionBuildersMap: ActionBuildersMap
  swapManager: ISwapManager
  addressBookManager: IAddressBookManager
  protocolsRegistry: IProtocolPluginsRegistry
  contractsProvider: IContractsProvider
}
