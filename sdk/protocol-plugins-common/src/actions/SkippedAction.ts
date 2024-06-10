import { BaseAction } from './BaseAction'
import { InputSlotsMapping } from '../types/InputSlotsMapping'
import { ActionCall } from './Types'
import { IAction } from '../interfaces/IAction'

export class SkippedAction extends BaseAction<typeof SkippedAction.Config> {
  static Config = {
    name: 'SkippedAction',
    version: 0,
    parametersAbi: ['()'],
    storageInputs: [],
    storageOutputs: [],
  } as const

  private _skippedAction: IAction

  public constructor(skippedAction: IAction) {
    super()

    this._skippedAction = skippedAction
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  public encodeCall(paramsMapping?: InputSlotsMapping): ActionCall {
    return {
      name: this._skippedAction.config.name,
      callData: '0x',
      targetHash: this._skippedAction.getActionHash(),
      skipped: true,
    }
  }

  public get config() {
    return SkippedAction.Config
  }

  public getVersionedName(): string {
    return this._skippedAction.getVersionedName()
  }
}
