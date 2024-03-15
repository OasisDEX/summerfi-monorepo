import { OrderPlanner } from '@summerfi/order-planner-common/implementation'
import { IOrderPlannerService } from '~orderplannerservice/interfaces'
import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import { ActionBuildersConfig } from '~orderplannerservice/config'
import { IUser } from '@summerfi/sdk-client'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { ProtocolBuilderRegistryType } from '@summerfi/order-planner-common/interfaces'

export class OrderPlannerService implements IOrderPlannerService {
  readonly orderPlanner: OrderPlanner
  readonly deploymentConfigTag: string
  readonly deployments: DeploymentIndex

  constructor({
    deployments,
    deploymentConfigTag = 'standard',
  }: {
    deployments: DeploymentIndex
    deploymentConfigTag?: string
  }) {
    this.orderPlanner = new OrderPlanner()
    this.deploymentConfigTag = deploymentConfigTag
    this.deployments = deployments
  }

  async buildOrder(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: Simulation<SimulationType>
    swapManager: ISwapManager
    protocolsRegistry: ProtocolBuilderRegistryType
  }): Promise<Maybe<Order>> {
    const deploymentKey = this._getDeploymentKey(params.user.chainInfo)
    const deployment = this.deployments[deploymentKey]
    if (!deployment) {
      throw new Error(`No deployment found for chain ${params.user.chainInfo.name}`)
    }

    return this.orderPlanner.buildOrder({
      user: params.user,
      positionsManager: params.positionsManager,
      simulation: params.simulation,
      actionBuildersMap: ActionBuildersConfig,
      deployment,
      swapManager: params.swapManager,
      protocolsRegistry: params.protocolsRegistry,
    })
  }

  private _getDeploymentKey(chainInfo: ChainInfo): string {
    return `${chainInfo.name}.${this.deploymentConfigTag}`
  }
}
