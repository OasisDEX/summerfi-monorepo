import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { TokenAmount } from '@summerfi/sdk-common/common/implementation'

export class SparkDepositAction extends BaseAction {
  public readonly config = {
    name: 'SparkDeposit',
    version: 1,
    parametersAbi: 'address asset, uint256 amount, bool sumAmounts, bool setAsCollateral',
    storageInputs: ['amountToDeposit'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(params: {
    depositAmount: TokenAmount
    sumAmounts: boolean
    setAsCollateral: boolean
  }): ActionCall {
    return this._encodeCall([
      params.depositAmount.token.address.toString(),
      params.depositAmount.toBaseUnit(),
      params.sumAmounts,
      params.setAsCollateral,
    ])
  }
}
