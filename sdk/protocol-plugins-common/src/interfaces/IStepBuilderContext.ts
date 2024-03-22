import { BaseAction } from '../actions/BaseAction'
import { ActionCallBatch } from '../actions/Types'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import { StorageInputsMapType, StorageOutputsMapType } from '../types/ActionStorageTypes'

export interface IStepBuilderContext {
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
