import { ActionNames } from '@summerfi/deployment-types'
import { ActionCall } from '~orderplanner'
import { Version } from '~orderplanner/interfaces/Types'

export abstract class BaseAction {
  public name: ActionNames
  public version: Version
  public parametersAbi: string

  constructor(name: ActionNames, version: Version, parametersAbi: string) {
    this.name = name
    this.version = version
    this.parametersAbi = parametersAbi
  }

  public abstract encode(params: unknown): ActionCall
}
