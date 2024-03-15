import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Token } from '@summerfi/sdk-common/common'

export class ReturnFundsAction extends BaseAction {
  public readonly config = {
    name: 'ReturnFunds',
    version: 1,
    parametersAbi: 'address asset',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(params: { asset: Token }, paramsMapping?: number[]): ActionCall {
    return this._encodeCall({
      arguments: [params.asset.address.value],
      mapping: paramsMapping,
    })
  }
}
