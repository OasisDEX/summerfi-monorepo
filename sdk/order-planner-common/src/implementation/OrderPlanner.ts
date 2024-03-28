import { Order, type IPositionsManager } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType, steps } from '@summerfi/sdk-common/simulation'
import { Deployment } from '@summerfi/deployment-utils'
import { Address, Maybe } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import { ISwapManager } from '@summerfi/swap-common/interfaces'
import { IUser } from '@summerfi/sdk-common/user'
import {
  ActionBuilder,
  ActionBuildersMap,
  ActionCall,
  IProtocolPluginsRegistry,
} from '@summerfi/protocol-plugins-common'
import { IOrderPlanner } from '../interfaces/IOrderPlanner'
import { OrderPlannerContext } from '../context/OrderPlannerContext'
import { encodeStrategy } from '../utils/EncodeStrategy'

export class OrderPlanner implements IOrderPlanner {
  private readonly ExecutorContractName = 'OperationExecutor'

  async buildOrder(params: {
    user: IUser
    positionsManager: IPositionsManager
    simulation: ISimulation<SimulationType>
    actionBuildersMap: ActionBuildersMap
    deployment: Deployment
    swapManager: ISwapManager
    protocolsRegistry: IProtocolPluginsRegistry
  }): Promise<Maybe<Order>> {
    const {
      user,
      positionsManager,
      simulation,
      actionBuildersMap,
      deployment,
      swapManager,
      protocolsRegistry,
    } = params

    const context: OrderPlannerContext = new OrderPlannerContext()

    context.startSubContext()

    for (const step of simulation.steps) {
      const stepBuilder = this.getActionBuilder(actionBuildersMap, step)
      if (!stepBuilder) {
        throw new Error(`No step builder found for step type ${step.type}`)
      }

      await stepBuilder({
        context,
        user,
        positionsManager,
        swapManager,
        deployment,
        step,
        protocolsRegistry,
      })
    }

    const { callsBatch } = context.endSubContext()

    if (context.subContextLevels !== 0) {
      throw new Error('Mismatched nested calls levels, probably a missing endSubContext call')
    }

    return this._generateOrder(simulation, callsBatch, deployment)
  }

  private getActionBuilder<T extends steps.Steps>(
    actionBuildersMap: ActionBuildersMap,
    step: T,
  ): Maybe<ActionBuilder<T>> {
    return actionBuildersMap[step.type] as ActionBuilder<T>
  }

  private _generateOrder(
    simulation: ISimulation<SimulationType>,
    simulationCalls: ActionCall[],
    deployment: Deployment,
  ): Order {
    const executorInfo = deployment.contracts[this.ExecutorContractName]
    if (!executorInfo) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }

    const calldata = encodeStrategy(simulation.simulationType, simulationCalls)

    return {
      simulation: simulation,
      transactions: [
        {
          transaction: {
            target: Address.createFromEthereum({ value: executorInfo.address as HexData }),
            calldata: calldata,
            value: '0',
          },
          description: 'Strategy execution',
        },
      ],
    }
  }
}
