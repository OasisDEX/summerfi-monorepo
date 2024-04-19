import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class CompoundV3WithdrawAction extends BaseAction {
  public readonly config = {
    name: 'CompoundV3Withdraw',
    version: 0,
    parametersAbi: '(address comet, address asset, uint256 amount, bool withdrawAll)',
    storageInputs: [],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(
    params: {
      comet: Address
      withdrawAmount: TokenAmount
      withdrawAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          comet: params.comet.value,
          asset: params.withdrawAmount.token.address.value,
          amount: params.withdrawAmount.toBaseUnit(),
          withdrawAll: params.withdrawAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
