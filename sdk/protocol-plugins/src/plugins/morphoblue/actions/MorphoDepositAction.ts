import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoMarketParametersAbi } from '../types/MorphoMarketParameters'

export class MorphoDepositAction extends BaseAction<typeof MorphoDepositAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueDeposit',
    version: 0,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, bool sumAmounts)',
      MorphoMarketParametersAbi,
    ],
    storageInputs: ['marketParams', 'amount', 'sumAmounts'],
    storageOutputs: ['depositedAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoLendingPool
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
            lltv: morphoLendingPool.lltv.toLTV().toSolidityValue({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount.toSolidityValue(),
          sumAmounts: sumAmounts,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoDepositAction.Config
  }
}
