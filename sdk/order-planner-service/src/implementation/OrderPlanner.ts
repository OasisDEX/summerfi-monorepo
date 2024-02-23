import { Order, Simulation, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { IOrderPlanner } from '~orderplanner/interfaces/IOrderPlanner'
import { Deployment } from '@summerfi/deployment-utils'
import { encodeStrategy } from '~orderplanner/utils'
import { OrderPlannerContext } from '~orderplanner/context'
import { ActionBuilder, ActionBuildersMap } from '~orderplanner/builders'
import { ActionCall } from '~orderplanner/actions'
import { PositionsManager, User } from '@summerfi/sdk-common/users'

export class OrderPlanner implements IOrderPlanner {
  private readonly ExecutorContractName = 'OperationExecutor'

  private readonly _actionBuildersMap: ActionBuildersMap
  private readonly _deployment: Deployment

  constructor(deployment: Deployment, actionBuildersMap: ActionBuildersMap) {
    this._deployment = deployment
    this._actionBuildersMap = actionBuildersMap
  }

  buildOrder(
    user: User,
    positionsManager: PositionsManager,
    simulation: Simulation<SimulationType>,
  ): Maybe<Order> {
    const context: OrderPlannerContext = new OrderPlannerContext()

    context.startSubContext()

    for (const step of simulation.steps) {
      const stepBuilder = this.getStepBuilder(step)
      if (!stepBuilder) {
        throw new Error(`No step builder found for step type ${step.type}`)
      }

      stepBuilder({ context, user, positionsManager, simulation, step })
    }

    const { callsBatch } = context.endSubContext()

    if (context.subContextLevels !== 0) {
      throw new Error('Mismatched nested calls levels, probably a missing endSubContext call')
    }

    return this._generateOrder(simulation, callsBatch)
  }

  private getStepBuilder<T extends Steps>(step: T): Maybe<ActionBuilder<T>> {
    return this._actionBuildersMap[step.type] as ActionBuilder<T>
  }

  private _generateOrder(
    simulation: Simulation<SimulationType>,
    simulationCalls: ActionCall[],
  ): Order {
    const executorInfo = this._deployment.contracts[this.ExecutorContractName]
    if (!executorInfo) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }

    const calldata = encodeStrategy(simulation.simulationType, simulationCalls)

    return {
      simulation: simulation,
      transactions: [
        {
          transaction: {
            target: executorInfo.address,
            calldata: calldata,
            value: '0',
          },
          description: 'Strategy execution',
        },
      ],
    }
  }
}
