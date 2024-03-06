import { OrderPlanner } from '@summerfi/order-planner-common/implementation'
import { IOrderPlannerService } from '~orderplannerservice/interfaces'
import { Order } from '@summerfi/sdk-common/orders'
import { Simulation, SimulationType } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import { ActionBuildersConfig } from '~orderplannerservice/config'
import { Chain, IPositionsManager, User } from '@summerfi/sdk-common/client'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { ISwapService } from '@summerfi/swap-common/interfaces'

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
    user: User
    positionsManager: IPositionsManager
    simulation: Simulation<SimulationType>
    swapService: ISwapService
  }): Promise<Maybe<Order>> {
    const deploymentKey = this._getDeploymentKey(params.user.chain)
    const deployment = this.deployments[deploymentKey]
    if (!deployment) {
      throw new Error(`No deployment found for chain ${params.user.chain.chainInfo.name}`)
    }

    return this.orderPlanner.buildOrder({
      user: params.user,
      positionsManager: params.positionsManager,
      simulation: params.simulation,
      actionBuildersMap: ActionBuildersConfig,
      deployment,
      swapService: params.swapService,
    })
  }

  private _getDeploymentKey(chain: Chain): string {
    return `${chain.chainInfo.name}.${this.deploymentConfigTag}`
  }
}
