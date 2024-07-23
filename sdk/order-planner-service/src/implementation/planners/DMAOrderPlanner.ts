import { IAddressBookManager } from '@summerfi/address-book-common'
import {
  IOrderPlanner,
  OrderPlannerParams,
  encodeStrategy,
  generateStrategyName,
} from '@summerfi/order-planner-common'
import {
  ActionBuildersMap,
  ActionCall,
  FilterStep,
  IActionBuilder,
  IStepBuilderContext,
  StepBuilderContext,
} from '@summerfi/protocol-plugins-common'
import { IUser } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common/common'
import { Order, TransactionInfo, type IPositionsManager } from '@summerfi/sdk-common/orders'
import {
  ISimulation,
  SimulationSteps,
  SimulationType,
  steps,
} from '@summerfi/sdk-common/simulation'

/**
 * @name DMAOrderPlanner
 * @description Order planner that generates transactions for the DMA system based on an input simulation
 *
 * @see IOrderPlanner
 */
export class DMAOrderPlanner implements IOrderPlanner {
  // TODO: receive it as parameter in the constructor
  private readonly ExecutorContractName = 'OperationExecutor'

  /** PUBLIC */

  /** @see IOrderPlanner.buildOrder */
  async buildOrder(params: OrderPlannerParams): Promise<Maybe<Order>> {
    const {
      user,
      positionsManager,
      simulation,
      actionBuildersMap,
      addressBookManager,
      swapManager,
      protocolsRegistry,
    } = params

    const context: IStepBuilderContext = new StepBuilderContext()

    context.startSubContext()

    for (const step of simulation.steps) {
      const stepBuilder = this._getActionBuilder(actionBuildersMap, step.type)
      if (!stepBuilder) {
        throw new Error(`No step builder found for step type ${step.type}`)
      }

      await stepBuilder.build({
        context,
        user,
        positionsManager,
        swapManager,
        addressBookManager,
        step,
        protocolsRegistry,
        actionBuildersMap,
      })
    }

    const { callsBatch } = context.endSubContext()

    if (context.subContextLevels !== 0) {
      throw new Error('Mismatched nested calls levels, probably a missing endSubContext call')
    }

    const preRequisiteTransactions = context.transactions

    return this._generateOrder({
      user,
      simulation,
      preRequisiteTransactions,
      simulationCalls: callsBatch,
      positionsManager,
      addressBookManager,
    })
  }

  /** @see IOrderPlanner.getAcceptedSimulations */
  async getAcceptedSimulations(): Promise<SimulationType[]> {
    return [SimulationType.Refinance, SimulationType.ImportPosition]
  }

  /** PRIVATE */

  private _getActionBuilder<
    StepType extends SimulationSteps,
    Step extends FilterStep<StepType, steps.Steps>,
  >(actionBuildersMap: ActionBuildersMap, stepType: StepType): Maybe<IActionBuilder<Step>> {
    const builder = actionBuildersMap[stepType]

    if (!builder) {
      return undefined
    }

    return new builder()
  }

  private async _generateOrder(params: {
    user: IUser
    simulation: ISimulation<SimulationType>
    preRequisiteTransactions: TransactionInfo[]
    simulationCalls: ActionCall[]
    positionsManager: IPositionsManager
    addressBookManager: IAddressBookManager
  }): Promise<Order> {
    const {
      user,
      simulation,
      preRequisiteTransactions,
      simulationCalls,
      positionsManager,
      addressBookManager,
    } = params

    const executorAddress = await addressBookManager.getAddressByName({
      name: this.ExecutorContractName,
      chainInfo: user.chainInfo,
    })
    if (!executorAddress) {
      throw new Error(`Executor contract ${this.ExecutorContractName} not found in deployment`)
    }
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
