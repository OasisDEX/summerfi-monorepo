import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IPercentage, ITokenAmount } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'

export class SwapAction extends BaseAction {
  public readonly config = {
    name: 'SwapAction',
    version: 3,
    parametersAbi:
      '(address fromAsset, address toAsset, uint256 amount, uint256 receiveAtLeast, uint256 fee, bytes withData, bool collectFeeFromToken)',
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
          amount: params.fromAmount.toBaseUnit(),
          receiveAtLeast: params.toMinimumAmount.toBaseUnit(),
          fee: params.fee.toBaseUnit({ decimals: 2 }),
          withData: params.withData,
          collectFeeFromToken: params.collectFeeInFromToken,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
