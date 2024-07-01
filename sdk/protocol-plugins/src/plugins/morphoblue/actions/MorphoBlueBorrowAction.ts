import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { IMorphoBlueLendingPool } from '../interfaces/IMorphoBlueLendingPool'
import { MorphoBlueLLTVPrecision } from '../constants/MorphoBlueConstants'
import { MorphoBlueMarketParametersAbi } from '../types/MorphoBlueMarketParameters'

export class MorphoBlueBorrowAction extends BaseAction<typeof MorphoBlueBorrowAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueBorrow',
    version: 0,
    parametersAbi: ['(MarketParams marketParams, uint256 amount)', MorphoBlueMarketParametersAbi],
    storageInputs: [],
    storageOutputs: ['borrowedAmount'],
  } as const

  public encodeCall(
    params: { morphoLendingPool: IMorphoBlueLendingPool; amount: ITokenAmount },
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
            lltv: BigInt(
              morphoLendingPool.lltv.toLTV().toBaseUnit({ decimals: MorphoBlueLLTVPrecision }),
            ),
          },
          amount: BigInt(amount.toBaseUnit()),
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoBlueBorrowAction.Config
  }
}
