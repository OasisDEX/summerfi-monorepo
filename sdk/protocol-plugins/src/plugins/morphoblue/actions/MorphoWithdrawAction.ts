import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'
import { MorphoMarketParametersAbi } from '../types/MorphoMarketParameters'

export class MorphoWithdrawAction extends BaseAction<typeof MorphoWithdrawAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueWithdraw',
    version: 0,
    parametersAbi: [
      '(MarketParams marketParams, uint256 amount, address to)',
      MorphoMarketParametersAbi,
    ],
    storageInputs: ['marketParams', 'amount', 'to'],
    storageOutputs: ['withdrawnAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPool: IMorphoLendingPool
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
            lltv: morphoLendingPool.lltv.toLTV().toSolidityValue({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount.toSolidityValue(),
          to: to.value,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return MorphoWithdrawAction.Config
  }
}
