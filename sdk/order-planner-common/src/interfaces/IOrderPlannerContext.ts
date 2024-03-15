import { StorageInputsMapType, StorageOutputsMapType } from './Types'
import { BaseAction } from '../actions/BaseAction'
import { ActionCallBatch } from '../actions/Types'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'

export interface IOrderPlannerContext {
  addActionCall<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    arguments: Parameters<Action['encodeCall']>[0]
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }): void

  startSubContext(params: { customData?: unknown }): void

  endSubContext<T>(): {
    callsBatch: ActionCallBatch
    customData: Maybe<T>
  }

  get subContextLevels(): number
}
