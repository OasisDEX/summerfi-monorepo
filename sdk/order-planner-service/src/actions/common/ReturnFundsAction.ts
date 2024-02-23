import { ActionCall, ActionConfig, BaseAction } from '~orderplanner/actions'
import { Token } from '@summerfi/sdk-common/common'

export class ReturnFundsAction extends BaseAction {
  public readonly config: ActionConfig = {
    name: 'ReturnFunds',
    version: 1,
    parametersAbi: 'address asset',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(params: { asset: Token }): ActionCall {
    return this._encodeCall([params.asset.address.toString()])
  }
}
