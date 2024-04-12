import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class AaveV2DepositAction extends BaseAction {
  public readonly config = {
    name: 'AaveDeposit',
    version: 3,
    parametersAbi: '(address asset, uint256 amount, bool sumAmounts, bool setAsCollateral)',
    storageInputs: ['amountToDeposit'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      depositAmount: TokenAmount
      sumAmounts: boolean
      setAsCollateral: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.depositAmount.token.address.value,
          amount: params.depositAmount.toBaseUnit(),
          sumAmounts: params.sumAmounts,
          setAsCollateral: params.setAsCollateral,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
