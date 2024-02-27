import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Token } from '@summerfi/sdk-common/common/implementation'

export class ReturnFundsAction extends BaseAction {
  public readonly config = {
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
