import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class PullTokenAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 3,
    parametersAbi: 'address asset, address from, uint256 amount',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { pullAmount: TokenAmount; pullTo: Address },
    paramsMapping?: InputSlotsMapping,
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
