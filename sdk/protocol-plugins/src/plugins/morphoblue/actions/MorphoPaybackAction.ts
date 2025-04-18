import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoMarketParametersAbi } from '../types/MorphoMarketParameters'

export class MorphoPaybackAction extends BaseAction<typeof MorphoPaybackAction.Config> {
  public static readonly Config = {
    name: 'MorphoBluePayback',
    version: 2,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, address onBehalf, bool paybackAll)',
      MorphoMarketParametersAbi,
    ],
    storageInputs: ['amount'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoLendingPool
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
            lltv: morphoLendingPool.lltv.toLTV().toSolidityValue({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount.toSolidityValue(),
          onBehalf: onBehalf.value,
          paybackAll: paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoPaybackAction.Config
  }
}
