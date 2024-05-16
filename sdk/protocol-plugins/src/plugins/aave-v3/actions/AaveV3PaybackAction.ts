import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'

export class AaveV3PaybackAction extends BaseAction<typeof AaveV3PaybackAction.Config> {
  public static readonly Config = {
    name: 'AaveV3Payback',
    version: 0,
    parametersAbi: ['(address asset, uint256 amount, bool paybackAll)'],
    storageInputs: ['asset', 'amountToPayback'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      paybackAmount: ITokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.paybackAmount.token.address.value,
          amount: BigInt(params.paybackAmount.toBaseUnit()),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return AaveV3PaybackAction.Config
  }
}
