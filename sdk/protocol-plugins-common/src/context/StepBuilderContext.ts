import { steps } from '@summerfi/sdk-common'
import { Maybe } from '@summerfi/sdk-common'
import { StorageInputsMapType, StorageOutputsMapType } from '../types/ActionStorageTypes'
import { BaseAction } from '../actions/BaseAction'
import { IStepBuilderContext } from '../interfaces/IStepBuilderContext'
import { ActionCallBatch, ActionConfig } from '../actions/Types'
import { ActionCallsStack } from './ActionCallsStack'
import { ExecutionStorageMapper } from './ExecutionStorageMapper'
import { TransactionInfo } from '@summerfi/sdk-common'
import { SkippedAction } from '../actions/SkippedAction'

/**
 * @name StepBuilderContext
 * @see IStepBuilderContext
 */
export class StepBuilderContext implements IStepBuilderContext {
  private _transactions: TransactionInfo[] = []
  private _calls: ActionCallsStack = new ActionCallsStack()
  private _storage: ExecutionStorageMapper = new ExecutionStorageMapper()

  /** @see IStepBuilderContext.addTransaction */
  public addTransaction(params: { transaction: TransactionInfo }): void {
    this._transactions.push(params.transaction)
  }

  /** @see IStepBuilderContext.addActionCall */
  public addActionCall<
    Step extends steps.Steps,
    Config extends ActionConfig,
    Action extends BaseAction<Config>,
  >(params: {
    step: Step
    action: BaseAction<Config>
    arguments: Parameters<Action['encodeCall']>[0]
    connectedInputs: Partial<StorageInputsMapType<Step, Config>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Config>>
    skip?: boolean
  }) {
    // TODO: temporary solution until we remove the Operations Registry
    if (params.skip) {
      const skipAction = new SkippedAction(params.action)

      this._calls.addCall({
        call: skipAction.encodeCall(),
      })

      return
    }

    const paramsMapping = this._storage.addStorageMap({
      step: params.step,
      action: params.action,
      connectedInputs: params.connectedInputs,
      connectedOutputs: params.connectedOutputs,
    })

    const call = params.action.encodeCall(params.arguments, paramsMapping)
    this._calls.addCall({ call })
  }

  /** @see IStepBuilderContext.startSubContext */
  public startSubContext(params: { customData?: unknown } = {}) {
    this._calls.startSubContext(params)
  }

  /** @see IStepBuilderContext.endSubContext */
  public endSubContext<T>(): {
    callsBatch: ActionCallBatch
    customData: Maybe<T>
  } {
    return this._calls.endSubContext() as { callsBatch: ActionCallBatch; customData: Maybe<T> }
  }

  /** @see IStepBuilderContext.subContextLevels */
  public get subContextLevels(): number {
    return this._calls.subContextLevels
  }

  /** @see IStepBuilderContext.transactions */
  public get transactions(): TransactionInfo[] {
    return this._transactions
  }
}
