import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { MorphoBlueLLTVPrecision } from '../constants/MorphoBlueConstants'
import { IAddress } from '@summerfi/sdk-common'
import { IMorphoBlueLendingPool } from '../interfaces/IMorphoBlueLendingPool'
import { MorphoBlueMarketParametersAbi } from '../types/MorphoBlueMarketParameters'

export class MorphoBluePaybackAction extends BaseAction<typeof MorphoBluePaybackAction.Config> {
  public static readonly Config = {
    name: 'MorphoBluePayback',
    version: 2,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, address onBehalf, bool paybackAll)',
      MorphoBlueMarketParametersAbi,
    ],
    storageInputs: ['amount'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoBlueLendingPool
      amount: ITokenAmount
      onBehalf: IAddress
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPool, amount, onBehalf, paybackAll } = params

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
          onBehalf: onBehalf.value,
          paybackAll: paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoBluePaybackAction.Config
  }
}
