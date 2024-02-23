import { ActionCall, BaseAction } from '~orderplanner/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class PullTokenAction extends BaseAction {
  public readonly config = {
    name: 'PullToken',
    version: 1,
    parametersAbi: 'address, address, uint256',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(params: { pullAmount: TokenAmount; pullTo: Address }): ActionCall {
    return this._encodeCall([
      params.pullAmount.token.address,
      params.pullTo.hexValue,
      params.pullAmount.toBaseUnit(),
    ])
  }
}
