import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common'

export class SparkDepositAction extends BaseAction<typeof SparkDepositAction.Config> {
  public static readonly Config = {
    name: 'SparkDeposit',
    version: 0,
    parametersAbi: ['(address asset, uint256 amount, bool sumAmounts, bool setAsCollateral)'],
    storageInputs: ['asset', 'amountToDeposit'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      depositAmount: ITokenAmount
      sumAmounts: boolean
      setAsCollateral: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.depositAmount.token.address.value,
          amount: params.depositAmount.toSolidityValue(),
          sumAmounts: params.sumAmounts,
          setAsCollateral: params.setAsCollateral,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SparkDepositAction.Config
  }
}
