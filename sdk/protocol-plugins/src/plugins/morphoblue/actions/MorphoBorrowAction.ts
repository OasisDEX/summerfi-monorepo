import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoMarketParametersAbi } from '../types/MorphoMarketParameters'

export class MorphoBorrowAction extends BaseAction<typeof MorphoBorrowAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueBorrow',
    version: 0,
    parametersAbi: ['(MarketParams marketParams, uint256 amount)', MorphoMarketParametersAbi],
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
            lltv: morphoLendingPool.lltv.toLTV().toSolidityValue({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount.toSolidityValue(),
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoBorrowAction.Config
  }
}
