import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

export class SparkPaybackAction extends BaseAction<typeof SparkPaybackAction.Config> {
  public static readonly Config = {
    name: 'SparkPayback',
    version: 2,
    parametersAbi: ['(address asset, uint256 amount, bool paybackAll, address onBehalf)'],
    storageInputs: ['asset', 'amountToPayback'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      paybackAmount: ITokenAmount
      paybackAll: boolean
      onBehalf: IAddress
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.paybackAmount.token.address.value,
          amount: params.paybackAmount.toSolidityValue(),
          paybackAll: params.paybackAll,
          onBehalf: params.onBehalf.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SparkPaybackAction.Config
  }
}
