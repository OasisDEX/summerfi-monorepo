import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class PullTokenAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 1,
    parametersAbi: 'address, address, uint256',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { pullAmount: TokenAmount; pullTo: Address },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        params.pullAmount.token.address.value,
        params.pullTo.value,
        params.pullAmount.toBaseUnit(),
      ],
      mapping: paramsMapping,
    })
  }
}
