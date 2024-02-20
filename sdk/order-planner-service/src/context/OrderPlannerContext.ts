import { BaseAction } from '~orderplanner/actions'
import { ActionCallsStack } from './ActionCallsStack'
import { ExecutionStorageManager } from './ExecutionStorageManager'
import { Steps } from '@summerfi/sdk-common/orders'
import { ActionCallBatch } from '~orderplanner'
import { Maybe } from '@summerfi/sdk-common/utils'

export class OrderPlannerContext {
  private _calls: ActionCallsStack = new ActionCallsStack()
  private _storage: ExecutionStorageManager = new ExecutionStorageManager()

  public addActionCall<S extends Steps, T extends BaseAction>(params: {
    step: S
    actionClass: new () => T
    arguments: Parameters<T['encodeCall']>[0]
  }) {
    const action = new params.actionClass()

    const call = action.encodeCall(params.arguments)
    this._calls.addCall({ call })
    this._storage.addStorageMap({
      stepName: params.step.name,
      storedValuesNames: action.storedValuesNames,
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
