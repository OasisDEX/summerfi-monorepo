import { ActionCall, ActionType } from '~orderplanner/interfaces/Action'
import { BaseAction } from './BaseAction'
import { Address, TokenAmount } from '@summerfi/sdk/common'
import { encodeAction } from '~orderplanner/utils/EncodeAction'

export class PullToken extends BaseAction {
  constructor() {
    super(ActionType.PullToken, 'PullToken', 1, 'address, address, uint256')
  }

  public encode(params: { pullAmount: TokenAmount; pullTo: Address }): ActionCall {
    return encodeAction(`${this.contractName}_v${this.version}`, this.parametersAbi, [
      params.pullAmount.token.address,
      params.pullTo.hexValue,
      params.pullAmount.toWei(),
    ])
  }
}
