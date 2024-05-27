import { Deployment, DeploymentIndex } from '@summerfi/deployment-utils'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { SetupDeployments } from './SetupDeployments'
import { IUser } from '@summerfi/sdk-common/user'
import { ActionBuildersMap, IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import {
  createEmptyBuildersProtocolPluginsRegistry,
  createEmptyProtocolPluginsRegistry,
  createNoCheckpointProtocolPluginsRegistry,
  createProtocolPluginsRegistry,
} from './ProtocolsPluginRegistryMock'
import {
  AddressBookManagerMock,
  StepBuilderContextMock,
  SwapManagerMock,
  UserMock,
} from '@summerfi/testing-utils'
import { IAddressBookManager } from '@summerfi/address-book-common'

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
    user: new UserMock({
      chainInfo: params.chainInfo,
      walletAddress: Address.createFromEthereum({
        value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
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
