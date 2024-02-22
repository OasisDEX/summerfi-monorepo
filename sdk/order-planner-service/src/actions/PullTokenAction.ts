import { ActionCall } from '~orderplanner/interfaces/Action'
import { BaseAction } from './BaseAction'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { ActionConfig } from './Types'

export class PullTokenAction extends BaseAction {
  public readonly config: ActionConfig = {
    name: 'PullToken',
    version: 1,
    parametersAbi: 'address, address, uint256',
    storageInputs: [],
    storageOutputs: [],
  }

  public encodeCall(params: { pullAmount: TokenAmount; pullTo: Address }): ActionCall {
    return this._encodeCall([
      params.pullAmount.token.address,
      params.pullTo.hexValue,
      params.pullAmount.toBaseUnit(),
    ])
  }
}
