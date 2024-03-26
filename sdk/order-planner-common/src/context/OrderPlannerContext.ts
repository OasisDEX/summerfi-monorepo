import { ActionCallsStack } from './ActionCallsStack'
import { ExecutionStorageMapper } from './ExecutionStorageMapper'
import { steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/common'
import {
  ActionCallBatch,
  BaseAction,
  IStepBuilderContext,
  StorageInputsMapType,
  StorageOutputsMapType,
} from '@summerfi/protocol-plugins-common'

export class OrderPlannerContext implements IStepBuilderContext {
  private _calls: ActionCallsStack = new ActionCallsStack()
  private _storage: ExecutionStorageMapper = new ExecutionStorageMapper()

  public addActionCall<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    arguments: Parameters<Action['encodeCall']>[0]
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }) {
    const paramsMapping = this._storage.addStorageMap({
      step: params.step,
      action: params.action,
      connectedInputs: params.connectedInputs,
      connectedOutputs: params.connectedOutputs,
    })

    const call = params.action.encodeCall(params.arguments, paramsMapping)
    this._calls.addCall({ call })
  }

  public startSubContext(params: { customData?: unknown } = {}) {
    this._calls.startSubContext(params)
  }

  public endSubContext<T>(): {
    callsBatch: ActionCallBatch
    customData: Maybe<T>
  } {
    return this._calls.endSubContext() as { callsBatch: ActionCallBatch; customData: Maybe<T> }
  }

  public get subContextLevels(): number {
    return this._calls.subContextLevels
  }
}
