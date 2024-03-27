import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class SparkDepositAction extends BaseAction {
  public readonly config = {
    name: 'SparkDeposit',
    version: 0,
    parametersAbi: 'address asset, uint256 amount, bool sumAmounts, bool setAsCollateral',
    storageInputs: ['amountToDeposit'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      depositAmount: TokenAmount
      sumAmounts: boolean
      setAsCollateral: boolean
    },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        params.depositAmount.token.address.value,
        params.depositAmount.toBaseUnit(),
        params.sumAmounts,
        params.setAsCollateral,
      ],
      mapping: paramsMapping,
    })
  }
}
