import { BaseAction } from '~orderplanner/actions'
import { ActionCallsStack } from './ActionCallsStack'
import { ExecutionStorageManager } from './ExecutionStorageManager'
import { Steps } from '@summerfi/sdk-common/orders'
import { ActionCallBatch } from '~orderplanner'
import { Maybe } from '@summerfi/sdk-common/utils'
import { StorageOutputsMapType } from './Types'

export class OrderPlannerContext {
  private _calls: ActionCallsStack = new ActionCallsStack()
  private _storage: ExecutionStorageManager = new ExecutionStorageManager()

  public addActionCall<Step extends Steps, Action extends BaseAction>(params: {
    step: Step
    action: Action
    arguments: Parameters<Action['encodeCall']>[0]
    connectedOutputs: StorageOutputsMapType<Step, Action>
  }) {
    const call = params.action.encodeCall(params.arguments)
    this._calls.addCall({ call })
    this._storage.addStorageMap({
      step: params.step,
      action: params.action,
      connectedOutputs: params.connectedOutputs,
    })
  }

  public startSubContext(params: { customData?: unknown } = {}) {
    this._calls.startSubContext(params)
  }

  public endSubContext<T>(): { callsBatch: ActionCallBatch; customData: Maybe<T> } {
    return this._calls.endSubContext() as { callsBatch: ActionCallBatch; customData: Maybe<T> }
  }

  public get subContextLevels(): number {
    return this._calls.levels
  }
}
