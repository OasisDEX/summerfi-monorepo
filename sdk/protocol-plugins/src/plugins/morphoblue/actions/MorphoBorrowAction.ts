import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { IMorphoLendingPoolId } from '../interfaces'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'

export class MorphoBorrowAction extends BaseAction {
  public readonly config = {
    name: 'MorphoBlueBorrow',
    version: 0,
    parametersAbi:
      '((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount)',
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: { morphoLendingPoolId: IMorphoLendingPoolId; amount: ITokenAmount },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPoolId, amount } = params

    return this._encodeCall({
      arguments: [
        {
          marketParams: {
            loanToken: morphoLendingPoolId.debtToken.address.value,
            collateralToken: morphoLendingPoolId.collateralToken.address.value,
            oracle: morphoLendingPoolId.oracle.value,
            irm: morphoLendingPoolId.irm.value,
            lltv: morphoLendingPoolId.lltv.toBaseUnit({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
