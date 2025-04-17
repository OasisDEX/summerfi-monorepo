import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IPercentage, ITokenAmount, HexData } from '@summerfi/sdk-common'

export class SwapAction extends BaseAction<typeof SwapAction.Config> {
  public static readonly Config = {
    name: 'SwapAction',
    version: 3,
    parametersAbi: [
      '(address fromAsset, address toAsset, uint256 amount, uint256 receiveAtLeast, uint256 fee, bytes withData, bool collectFeeFromToken)',
    ],
    storageInputs: [],
    storageOutputs: ['received'],
  } as const

  public encodeCall(
    params: {
      fromAmount: ITokenAmount
      toMinimumAmount: ITokenAmount
      fee: IPercentage
      withData: HexData
      collectFeeInFromToken: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          fromAsset: params.fromAmount.token.address.value,
          toAsset: params.toMinimumAmount.token.address.value,
          amount: params.fromAmount.toSolidityValue(),
          receiveAtLeast: params.toMinimumAmount.toSolidityValue(),
          fee: params.fee.toSolidityValue({ decimals: 2 }),
          withData: params.withData,
          collectFeeFromToken: params.collectFeeInFromToken,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SwapAction.Config
  }
}
