import { ActionCallsStack } from './ActionCallsStack'
import { ExecutionStorageMapper } from './ExecutionStorageMapper'
import { isValueReference, steps } from '@summerfi/sdk-common/simulation'
import { Maybe } from '@summerfi/sdk-common/utils'
import { StorageInputsMapType, StorageOutputsMapType } from './Types'
import { BaseAction } from '../actions/BaseAction'
import { ActionCallBatch } from '../actions/Types'

export class OrderPlannerContext {
  private _calls: ActionCallsStack = new ActionCallsStack()
  private _storage: ExecutionStorageMapper = new ExecutionStorageMapper()

  public addActionCall<Step extends steps.Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    arguments: Parameters<Action['encodeCall']>[0]
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
    connectedOutputs: Partial<StorageOutputsMapType<Step, Action>>
  }) {
    const paramsMapping = this._resolveParamsMapping({
      action: params.action,
      step: params.step,
      connectedInputs: params.connectedInputs,
    })
    const call = params.action.encodeCall({ arguments: params.arguments, mapping: paramsMapping })
    this._calls.addCall({ call })
    this._storage.addStorageMap({
      step: params.step,
      action: params.action,
      connectedInputs: params.connectedInputs,
      connectedOutputs: params.connectedOutputs,
    })
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
    return this._calls.levels
  }

  private _resolveParamsMapping<Step extends steps.Steps, Action extends BaseAction>(params: {
    action: Action
    step: Step
    connectedInputs: Partial<StorageInputsMapType<Step, Action>>
  }): number[] {
    const paramsMapping: number[] = [0, 0, 0, 0]

    for (const [key, value] of Object.entries(params.step.inputs)) {
      if (!isValueReference(value)) {
        continue
      }

      const actionStorageName = params.connectedInputs[key as keyof Step['inputs']]
      if (actionStorageName === undefined) {
        continue
      }

      const [stepName, referenceName] = value.path

      const paramSlotValue = this._storage.getSlot({ stepName, referenceName })
      if (!paramSlotValue) {
        throw new Error(`Reference not found in storage: ${stepName}-${referenceName}`)
      }

      const paramSlotIndex = params.action.config.storageInputs.findIndex(
        (storageInputName) => storageInputName === actionStorageName,
      )
      if (paramSlotIndex === -1) {
        throw new Error(`Input not found in action storage inputs: ${actionStorageName}`)
      }

      paramsMapping[paramSlotIndex] = paramSlotValue
    }

    return paramsMapping
  }
}
