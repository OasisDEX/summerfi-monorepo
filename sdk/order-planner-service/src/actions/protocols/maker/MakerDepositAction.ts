import { ActionCall, ActionConfig, BaseAction } from '~orderplanner/actions'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class MakerDepositAction extends BaseAction {
  public readonly config: ActionConfig = {
    name: 'SparkDeposit',
    version: 1,
    parametersAbi: 'address joinAddress, uint256 vaultId, uint256 amount',
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
