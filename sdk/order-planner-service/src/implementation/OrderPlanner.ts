import { Order, Simulation, SimulationType } from '@summerfi/sdk-common/orders'
import { Maybe } from '@summerfi/sdk-common/utils'
import { IOrderPlanner } from '~orderplanner/interfaces/IOrderPlanner'
import { ActionCall, OrderPlannerContext, StepBuildersMap } from '~orderplanner/interfaces'
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
    const context: OrderPlannerContext = {
      calls: [],
    }

    const simulationCalls = simulation.steps.reduce((actions, step) => {
      const stepBuilder = this._stepBuildersMap[step.type]
      if (!stepBuilder) {
        throw new Error(`No step builder found for step type ${step.type}`)
      }

      const actionCalls = stepBuilder({ context, simulation, step })

      return [...actions, ...actionCalls]
    }, [] as ActionCall[])

    return this._generateOrder(simulation, simulationCalls)
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
