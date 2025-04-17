import { IAddressBookManager } from '@summerfi/address-book-common'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import { Address, ChainInfo, Wallet } from '@summerfi/sdk-common'
import { IPositionsManager } from '@summerfi/sdk-common'
import { IUser, User } from '@summerfi/sdk-common'
import {
  AddressBookManagerMock,
  StepBuilderContextMock,
  SwapManagerMock,
} from '@summerfi/testing-utils'
import {
  createEmptyBuildersProtocolPluginsRegistry,
  createEmptyProtocolPluginsRegistry,
  createNoCheckpointProtocolPluginsRegistry,
  createProtocolPluginsRegistry,
} from './ProtocolsPluginRegistryMock'

export type SetupBuilderReturnType = {
  context: StepBuilderContextMock
  user: IUser
  positionsManager: IPositionsManager
  swapManager: SwapManagerMock
  addressBookManager: IAddressBookManager
  protocolsRegistry: IProtocolPluginsRegistry
  actionBuildersMap: ActionBuildersMap
  emptyProtocolsRegistry: IProtocolPluginsRegistry
  emptyBuildersProtocolRegistry: IProtocolPluginsRegistry
  noCheckpointProtocolsRegistry: IProtocolPluginsRegistry
}

export function setupBuilderParams(params: { chainInfo: ChainInfo }): SetupBuilderReturnType {
  const protocolsRegistry = createProtocolPluginsRegistry()
  const emptyProtocolsRegistry = createEmptyProtocolPluginsRegistry()
  const noCheckpointProtocolsRegistry = createNoCheckpointProtocolPluginsRegistry()
  const emptyBuildersProtocolRegistry = createEmptyBuildersProtocolPluginsRegistry()

  return {
    context: new StepBuilderContextMock(),
    user: User.createFrom({
      chainInfo: params.chainInfo,
      wallet: Wallet.createFrom({
        address: Address.createFromEthereum({
          value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
        }),
      }),
    }),
    positionsManager: {
      address: Address.ZeroAddressEthereum,
    },
    swapManager: new SwapManagerMock(),
    addressBookManager: new AddressBookManagerMock(),
    protocolsRegistry: protocolsRegistry,
    actionBuildersMap: {} as ActionBuildersMap,
    emptyProtocolsRegistry: emptyProtocolsRegistry,
    noCheckpointProtocolsRegistry: noCheckpointProtocolsRegistry,
    emptyBuildersProtocolRegistry: emptyBuildersProtocolRegistry,
  }
}
