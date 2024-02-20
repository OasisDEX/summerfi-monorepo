import { Order, Simulation, SimulationType, Steps } from '@summerfi/sdk-common/orders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { IOrderPlanner } from '~orderplanner/interfaces/IOrderPlanner'
import {
  ActionCall,
  OrderPlannerContext,
  StepBuilder,
  StepBuildersMap,
} from '~orderplanner/interfaces'
import { Deployment } from '@summerfi/deployment-utils'
import { encodeStrategy, getStrategyName } from '~orderplanner/utils'

export class OrderPlanner implements IOrderPlanner {
  private readonly ExecutorContractName = 'OperationExecutor'

  private readonly _stepBuildersMap: StepBuildersMap
  private readonly _deployment: Deployment

  constructor(deployment: Deployment, stepBuildersMap: StepBuildersMap) {
    this._deployment = deployment
    this._stepBuildersMap = stepBuildersMap
  }

  buildOrder(simulation: Simulation<SimulationType>): Maybe<Order> {
    const context: OrderPlannerContext = new OrderPlannerContext()

    context.startSubContext()

    for (const step of simulation.steps) {
      const stepBuilder = this.getStepBuilder(step)
      if (!stepBuilder) {
        throw new Error(`No step builder found for step type ${step.type}`)
      }

      stepBuilder({ context, simulation, step })
    }

    const { callsBatch } = context.endSubContext()

    if (context.subContextLevels !== 0) {
      throw new Error('Mismatched nested calls levels, probably a missing endSubContext call')
    }

    return this._generateOrder(simulation, callsBatch)
  }

  private getStepBuilder<T extends Steps>(step: T): Maybe<StepBuilder<T>> {
    return this._stepBuildersMap[step.type] as StepBuilder<T>
  }

  private _generateOrder(
    simulation: Simulation<SimulationType>,
    simulationCalls: ActionCall[],
  ): Order {
    const executorInfo = this._deployment.contracts[this.ExecutorContractName]
    if (!executorInfo) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }

    const strategyName = getStrategyName(simulation)
    if (!strategyName) {
      throw new Error('No strategy name found for simulation')
    }

    const calldata = encodeStrategy(strategyName, simulationCalls)

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
