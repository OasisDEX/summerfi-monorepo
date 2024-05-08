import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { IMorphoLendingPoolId } from '../interfaces/IMorphoLendingPoolId'
import { MorphoLLTVPrecision } from '../constants/MorphoConstants'
import { IAddress } from '@summerfi/sdk-common'

export class MorphoPaybackAction extends BaseAction {
  public readonly config = {
    name: 'MorphoBluePayback',
    version: 0,
    parametersAbi:
      '((address loanToken, address collateralToken, address oracle, address irm, uint256 lltv) marketParams, uint256 amount, address onBehalf, bool paybackAll)',
    storageInputs: ['amount'],
    storageOutputs: ['paybackedAmount'],
  } as const

  public encodeCall(
    params: {
      morphoLendingPoolId: IMorphoLendingPoolId
      amount: ITokenAmount
      onBehalf: IAddress
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const { morphoLendingPoolId, amount, onBehalf, paybackAll } = params

    return this._encodeCall({
      arguments: [
        {
          marketParams: {
            loanToken: morphoLendingPoolId.debtToken.address.value,
            collateralToken: morphoLendingPoolId.collateralToken.address.value,
            oracle: morphoLendingPoolId.oracle.value,
            irm: morphoLendingPoolId.irm.value,
            lltv: morphoLendingPoolId.lltv.toBaseUnit({ decimals: MorphoLLTVPrecision }),
          },
          amount: amount,
          onBehalf: onBehalf.value,
          paybackAll: paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
