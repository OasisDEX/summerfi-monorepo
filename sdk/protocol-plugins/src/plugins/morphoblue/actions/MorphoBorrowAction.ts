import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
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
    params: { morphoLendingPool: IMorphoLendingPool; amount: ITokenAmount },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPool, amount } = params

    return this._encodeCall({
      arguments: [
        {
          marketParams: {
            loanToken: morphoLendingPool.debtToken.address.value,
            collateralToken: morphoLendingPool.collateralToken.address.value,
            oracle: morphoLendingPool.oracle.value,
            irm: morphoLendingPool.irm.value,
            lltv: morphoLendingPool.lltv.toLTV().toBaseUnit({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
