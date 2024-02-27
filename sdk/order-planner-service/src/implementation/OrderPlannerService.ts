import { OrderPlanner } from '@summerfi/order-planner-common/implementation'
import { Deployments } from '@summerfi/core-contracts'
import { IOrderPlannerService } from '~orderplannerservice/interfaces'
import { PositionsManager, User } from '@summerfi/sdk-common/users'
import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { ActionBuildersConfig } from '~orderplannerservice/config'
import { Chain } from '@summerfi/sdk-common/chains'
import { DeploymentIndex } from '@summerfi/deployment-utils'

export class OrderPlannerService implements IOrderPlannerService {
  readonly orderPlanner: OrderPlanner
  readonly deploymentConfigTag: string
  readonly deployments = Deployments as DeploymentIndex

  constructor(deploymentConfigTag = 'standard') {
    this.orderPlanner = new OrderPlanner()
    this.deploymentConfigTag = deploymentConfigTag
  }

  buildOrder(params: {
    user: User
    positionsManager: PositionsManager
    simulation: Simulation<SimulationType>
  }): Maybe<Order> {
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
    })
  }

  private _getDeploymentKey(chain: Chain): string {
    return `${chain.chainInfo.name}.${this.deploymentConfigTag}`
  }
}
