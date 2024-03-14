import { Deployment, DeploymentIndex } from '@summerfi/deployment-utils'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'
import { IUser } from '@summerfi/sdk-client'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { Address, ChainInfo } from '@summerfi/sdk-common/common'
import { SwapManagerMock } from '../mocks/SwapManagerMock'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ProtocolBuilderMock } from '../mocks/ProtocolBuilderMock'
import { OrderPlannerContextMock } from '../mocks/OrderPlannerContextMock'
import { SetupDeployments } from './SetupDeployments'
import { UserMock } from '../mocks/UserMock'

export type SetupBuilderReturnType = {
  context: OrderPlannerContextMock
  user: IUser
  positionsManager: IPositionsManager
  swapManager: SwapManagerMock
  deployment: Deployment
  protocolsRegistry: ProtocolBuilderRegistryType
  deploymentIndex: DeploymentIndex
}

export function setupBuilderParams(params: {
  chainInfo: ChainInfo
  deploymentKey?: string
}): SetupBuilderReturnType {
  const deploymentIndex = SetupDeployments()

  return {
    context: new OrderPlannerContextMock(),
    user: new UserMock({
      chainInfo: params.chainInfo,
      walletAddress: Address.createFrom({ value: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43' }),
    }),
    positionsManager: {
      address: Address.ZeroAddressEthereum,
    },
    swapManager: new SwapManagerMock(),
    deployment: deploymentIndex[params.deploymentKey ?? 'Mainnet.standard'],
    protocolsRegistry: {
      [ProtocolName.Maker]: ProtocolBuilderMock,
      [ProtocolName.Spark]: ProtocolBuilderMock,
    },
    deploymentIndex: deploymentIndex,
  }
}
