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
  IStepBuilderContext,
  StepBuilderContext,
} from '@summerfi/protocol-plugins-common'
import { IOrderPlanner } from '../interfaces/IOrderPlanner'
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

    const context: IStepBuilderContext = new StepBuilderContext()

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

    return this._generateOrder(simulation, callsBatch, positionsManager, deployment)
  }

  private getActionBuilder<T extends steps.Steps>(
    actionBuildersMap: ActionBuildersMap,
    step: T,
  ): Maybe<ActionBuilder<T>> {
    return actionBuildersMap[step.type] as ActionBuilder<T>
  }

  private _getStrategyName(simulation: Simulation<SimulationType>): string {
    return `${simulation.simulationType}${simulation.sourcePosition?.pool.protocol.name}${simulation.targetPosition?.pool.protocol.name}`
  }

  private _generateOrder(
    simulation: ISimulation<SimulationType>,
    simulationCalls: ActionCall[],
    positionsManager: IPositionsManager,
    deployment: Deployment,
  ): Order {
    const executorInfo = deployment.contracts[this.ExecutorContractName]
    if (!executorInfo) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }
    const executorAddress = Address.createFromEthereum({ value: executorInfo.address as HexData })
    const strategyName = this._getStrategyName(simulation)

    const calldata = encodeStrategy({
      strategyName: strategyName,
      strategyExecutor: executorAddress,
      actions: simulationCalls,
    })

    return {
      simulation: simulation,
      transactions: [
        {
          transaction: {
            target: positionsManager.address,
            calldata: calldata,
            value: '0',
          },
          description: 'Strategy execution',
        },
      ],
    }
  }
}
