import { ActionCall, ActionType } from '~orderplanner'
import { Version } from '~orderplanner/interfaces/Types'

export abstract class BaseAction {
  public type: ActionType
  public contractName: string
  public version: Version
  public parametersAbi: string

  constructor(type: ActionType, contractName: string, version: Version, parametersAbi: string) {
    this.type = type
    this.contractName = contractName
    this.version = version
    this.parametersAbi = parametersAbi
  }

  public abstract encode(params: unknown): ActionCall
}
