import { Maybe } from '@summerfi/sdk'
import { ActionDefinition, ActionType } from '~orderplanner/interfaces'

type ActionHashedKey = string
type ActionsBuildersMap = Map<ActionHashedKey, ActionDefinition>

/**
 * @name ActionsRegistry
 * @description Registry of the actions that can be used to build an strategy
 */
export class ActionsRegistry {
  private static _builders: ActionsBuildersMap

  public static getActionDefinition(params: {
    actionType: ActionType
    version: number
  }): Maybe<ActionDefinition> {
    const actionKey = this._hashActionKey(params)

    if (!this._builders || !this._builders.has(actionKey)) {
      return undefined
    }

    return this._builders.get(actionKey)
  }

  public static registerAction(params: { actionDefinition: ActionDefinition }): void {
    if (!this._builders) {
      this._builders = new Map()
    }

    const actionKey = this._hashActionKey({
      actionType: params.actionDefinition.type,
      version: params.actionDefinition.version,
    })

    if (this._builders.has(actionKey)) {
      throw new Error(`Action ${actionKey} already registered`)
    }

    this._builders.set(actionKey, params.actionDefinition)
  }

  private static _hashActionKey(params: {
    actionType: ActionType
    version: number
  }): ActionHashedKey {
    return JSON.stringify(params)
  }
}
