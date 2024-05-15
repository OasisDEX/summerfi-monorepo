import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IAddress } from '@summerfi/sdk-common'
import { IMorphoLendingPool } from '../interfaces/IMorphoLendingPool'

export class MorphoWithdrawAction extends BaseAction<typeof MorphoWithdrawAction.Config> {
  public static readonly Config = {
    name: 'MorphoBlueWithdraw',
    version: 0,
    parametersAbi: [
      '((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, address to)',
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
            lltv: BigInt(morphoLendingPool.lltv.toBaseUnit({ decimals: MorphoLLTVPrecision })),
          },
          amount: BigInt(amount.toBaseUnit()),
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
