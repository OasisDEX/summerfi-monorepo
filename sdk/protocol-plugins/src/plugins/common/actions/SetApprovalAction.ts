import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class SetApprovalAction extends BaseAction {
  public readonly config = {
    name: 'SetApproval',
    version: 3,
    parametersAbi: '(address asset, address delegate, uint256 amount, bool sumAmounts)',
    storageInputs: ['asset', 'delegate', 'approvalAmount'],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: {
      approvalAmount: TokenAmount
      delegate: Address
      sumAmounts: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.approvalAmount.token.address.value,
          delegate: params.delegate.value,
          amount: params.approvalAmount.toBaseUnit(),
          sumAmounts: params.sumAmounts,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
