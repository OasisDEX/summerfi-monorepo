import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class CompoundV3DepositAction extends BaseAction {
  public readonly config = {
    name: 'CompoundV3Deposit',
    version: 0,
    parametersAbi: '(address comet, address asset, uint256 amount)',
    storageInputs: ['amountToDeposit'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      comet: Address
      depositAmount: TokenAmount
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          comet: params.comet.value,
          asset: params.depositAmount.token.address.value,
          amount: params.depositAmount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
