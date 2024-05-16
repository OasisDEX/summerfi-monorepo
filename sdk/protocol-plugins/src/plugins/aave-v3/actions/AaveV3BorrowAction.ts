import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common/common'

export class AaveV3BorrowAction extends BaseAction<typeof AaveV3BorrowAction.Config> {
  public static readonly Config = {
    name: 'AaveV3Borrow',
    version: 0,
    parametersAbi: ['(address asset, uint256 amount, address to)'],
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: { borrowAmount: ITokenAmount; borrowTo: IAddress },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.borrowAmount.token.address.value,
          amount: BigInt(params.borrowAmount.toBaseUnit()),
          to: params.borrowTo.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return AaveV3BorrowAction.Config
  }
}
