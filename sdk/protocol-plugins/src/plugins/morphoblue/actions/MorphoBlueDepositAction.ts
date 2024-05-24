import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { MorphoBlueLLTVPrecision } from '../constants/MorphoBlueConstants'
import { IMorphoBlueLendingPool } from '../interfaces/IMorphoBlueLendingPool'
import { MorphoBlueMarketParametersAbi } from '../types/MorphoBlueMarketParameters'

export class MorphoBlueDepositAction extends BaseAction<typeof MorphoBlueDepositAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueDeposit',
    version: 0,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, bool sumAmounts)',
      MorphoBlueMarketParametersAbi,
    ],
    storageInputs: ['marketParams', 'amount', 'sumAmounts'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoBlueLendingPool
      amount: ITokenAmount
      sumAmounts: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPool, amount, sumAmounts } = params

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
          sumAmounts: sumAmounts,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoBlueDepositAction.Config
  }
}
