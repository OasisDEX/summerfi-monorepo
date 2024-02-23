import { ActionCall, BaseAction } from '~orderplanner/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class SetApprovalAction extends BaseAction {
  public readonly config = {
    name: 'SetApproval',
    version: 1,
    parametersAbi: 'address asset, address delegate, uint256 amount, bool sumAmounts',
    storageInputs: ['approvalAmount'],
    storageOutputs: ['received'],
  } as const

  public encodeCall(params: {
    approvalAmount: TokenAmount
    delegate: Address
    sumAmounts: boolean
  }): ActionCall {
    return this._encodeCall([
      params.approvalAmount.token.address.hexValue,
      params.delegate.hexValue,
      params.approvalAmount.toBaseUnit(),
      params.sumAmounts,
    ])
  }
}
