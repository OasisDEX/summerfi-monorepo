import { BaseAction } from '../actions/BaseAction'
import { ActionCallBatch } from '../actions/Types'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import { StorageInputsMapType, StorageOutputsMapType } from '../types/ActionStorageTypes'
import { TransactionInfo } from '@summerfi/sdk-common/orders'

/**
 * @name IStepBuilderContext
 *
 *  Step builder context. Helper to accumulate actions calldata in different batches. Each batch is a subcontext
 *  and when a subcontext is finished, the calls batch and the custom data saved in the subcontext is returned
 */
export interface IStepBuilderContext {
  /**
   * Adds a full formed transaction to the context
   * @param transaction A full formed transaction
   */
  addTransaction(params: { transaction: TransactionInfo }): void

  /**
   * Adds an action call to the context
   * @param step The step to which the action belongs
   * @param action The action to be called
   * @param arguments The arguments to be passed to the action
   * @param connectedInputs The connected inputs to the action, this is the values that the action
   *                        will read from storage
   * @param connectedOutputs The connected outputs to the action, this is the values that the action
   *                         will write to storage
   */
  addActionCall<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    arguments: Parameters<Action['encodeCall']>[0]
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }): void

  /**
   * Starts a new subcontext and saves the optional custom data as part of the subcontext
   * @param customData Optional custom data to be saved as part of the subcontext
   */
  startSubContext(params?: { customData?: unknown }): void

  /**
   * Ends the current subcontext and returns the calls batch and the custom data saved in the subcontext
   * @returns The calls batch and the custom data saved in the subcontext
   *
   * @template T The type of the custom data saved in the subcontext
   *
   * This allows along startSubContext to batch action calls in order to pass them as parameters to an action
   * In particular this is used for flashloan actions, where the calls batch is passed as a parameter to the flashloan action
   */
  endSubContext<T>(): {
    callsBatch: ActionCallBatch
    customData: Maybe<T>
  }

  /**
   * The current subcontext levels
   */
  get subContextLevels(): number

  /**
   * The transactions saved in the context
   */
  get transactions(): TransactionInfo[]
}
