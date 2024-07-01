import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { MorphoBlueLLTVPrecision } from '../constants/MorphoBlueConstants'
import { IAddress } from '@summerfi/sdk-common'
import { IMorphoBlueLendingPool } from '../interfaces/IMorphoBlueLendingPool'
import { MorphoBlueMarketParametersAbi } from '../types/MorphoBlueMarketParameters'

export class MorphoBlueWithdrawAction extends BaseAction<typeof MorphoBlueWithdrawAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueWithdraw',
    version: 0,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, address to)',
      MorphoBlueMarketParametersAbi,
    ],
    storageInputs: ['marketParams', 'amount', 'to'],
    storageOutputs: ['withdrawnAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoBlueLendingPool
      amount: ITokenAmount
      to: IAddress
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPool, amount, to } = params

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
          to: to.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoBlueWithdrawAction.Config
  }
}
