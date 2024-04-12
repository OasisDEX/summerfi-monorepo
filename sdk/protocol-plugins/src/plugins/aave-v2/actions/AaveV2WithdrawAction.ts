import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class AaveV2WithdrawAction extends BaseAction {
  public readonly config = {
    name: 'AaveWithdraw',
    version: 3,
    parametersAbi: '(address asset, uint256 amount, bool withdrawAll)',
    storageInputs: ['amountToWithdraw'],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(
    params: { withdrawAmount: TokenAmount; withdrawTo: Address },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.withdrawAmount.token.address,
          amount: params.withdrawAmount.toBaseUnit(),
          to: params.withdrawTo.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
