import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

export class MorphoDepositAction extends BaseAction<typeof MorphoDepositAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueDeposit',
    version: 0,
    parametersAbi: [
      '((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, bool sumAmounts)',
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
            lltv: BigInt(morphoLendingPool.lltv.toBaseUnit({ decimals: MorphoLLTVPrecision })),
          },
          amount: BigInt(amount.toBaseUnit()),
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
