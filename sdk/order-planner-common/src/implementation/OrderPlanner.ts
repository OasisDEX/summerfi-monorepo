import { Order, type IPositionsManager, TransactionInfo } from '@summerfi/sdk-common/orders'
import { ISimulation, SimulationType, steps } from '@summerfi/sdk-common/simulation'
import { Deployment } from '@summerfi/deployment-utils'
import { Address, Maybe } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import {
  ActionBuilder,
  ActionBuildersMap,
  ActionCall,
  IStepBuilderContext,
  StepBuilderContext,
} from '@summerfi/protocol-plugins-common'
import { IOrderPlanner, OrderPlannerParams } from '../interfaces/IOrderPlanner'
import { encodeStrategy } from '../utils/EncodeStrategy'
import { generateStrategyName } from '../utils/GenerateStrategyName'

export class OrderPlanner implements IOrderPlanner {
  // TODO: receive it as parameter in the constructor
  private readonly ExecutorContractName = 'OperationExecutor'

  async buildOrder(params: OrderPlannerParams): Promise<Maybe<Order>> {
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
      const stepBuilder = this._getActionBuilder(actionBuildersMap, step)
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

    const preRequisiteTransactions = context.transactions

    return this._generateOrder({
      simulation,
      preRequisiteTransactions,
      simulationCalls: callsBatch,
      positionsManager,
      deployment,
    })
  }

  private _getActionBuilder<T extends steps.Steps>(
    actionBuildersMap: ActionBuildersMap,
    step: T,
  ): Maybe<ActionBuilder<T>> {
    return actionBuildersMap[step.type] as ActionBuilder<T>
  }

  private _generateOrder(params: {
    simulation: ISimulation<SimulationType>
    preRequisiteTransactions: TransactionInfo[]
    simulationCalls: ActionCall[]
    positionsManager: IPositionsManager
    deployment: Deployment
  }): Order {
    const { simulation, preRequisiteTransactions, simulationCalls, positionsManager, deployment } =
      params

    const executorInfo = deployment.contracts[this.ExecutorContractName]
    if (!executorInfo) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }
    const executorAddress = Address.createFromEthereum({ value: executorInfo.address as HexData })
    const strategyName = generateStrategyName(simulation)

    const strategyExecutorTransaction = encodeStrategy({
      strategyName: strategyName,
      strategyExecutor: executorAddress,
      positionsManager: positionsManager,
      actions: simulationCalls,
    })

    const transactions = [...preRequisiteTransactions]

    if (strategyExecutorTransaction) {
      transactions.push(strategyExecutorTransaction)
    }

    return {
      simulation,
      transactions,
    }
  }
}
