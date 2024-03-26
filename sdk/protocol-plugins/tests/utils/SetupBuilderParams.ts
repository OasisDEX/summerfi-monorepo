import { Deployment, DeploymentIndex } from '@summerfi/deployment-utils'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { SwapManagerMock } from '../mocks/SwapManagerMock'
import { StepBuilderContextMock } from '../mocks/StepBuilderContextMock'
import { SetupDeployments } from './SetupDeployments'
import { UserMock } from '../mocks/UserMock'
import { IUser } from '@summerfi/sdk-common/user'
import { IProtocolPluginsRegistry } from '@summerfi/protocol-plugins-common'
import {
  createEmptyBuildersProtocolPluginsRegistry,
  createEmptyProtocolPluginsRegistry,
  createNoCheckpointProtocolPluginsRegistry,
  createProtocolPluginsRegistry,
} from '../mocks/ProtocolsPluginRegistryMock'

export type SetupBuilderReturnType = {
  context: StepBuilderContextMock
  user: IUser
  positionsManager: IPositionsManager
  swapManager: SwapManagerMock
  deployment: Deployment
  protocolsRegistry: IProtocolPluginsRegistry
  emptyProtocolsRegistry: IProtocolPluginsRegistry
  emptyBuildersProtocolRegistry: IProtocolPluginsRegistry
  noCheckpointProtocolsRegistry: IProtocolPluginsRegistry
  deploymentIndex: DeploymentIndex
}

export function setupBuilderParams(params: {
  chainInfo: ChainInfo
  deploymentKey?: string
}): SetupBuilderReturnType {
  const deploymentIndex = SetupDeployments()
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
    deployment: deploymentIndex[params.deploymentKey ?? 'Mainnet.standard'],
    protocolsRegistry: protocolsRegistry,
    emptyProtocolsRegistry: emptyProtocolsRegistry,
    noCheckpointProtocolsRegistry: noCheckpointProtocolsRegistry,
    emptyBuildersProtocolRegistry: emptyBuildersProtocolRegistry,
    deploymentIndex: deploymentIndex,
  }
}
