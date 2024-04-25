import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IPosition, TokenAmount } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { isMakerPositionId } from '../interfaces'

export class MakerPaybackAction extends BaseAction {
  public readonly config = {
    name: 'MakerPayback',
    version: 0,
    parametersAbi: '(uint256 vaultId, address userAddress, uint256 amount, bool paybackAll)',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(
    params: {
      position: IPosition
      positionsManager: IPositionsManager
      amount: TokenAmount
      paybackAll: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    if (!isMakerPositionId(params.position.id)) {
      throw new Error(`Position ID is not a Maker one: ${JSON.stringify(params.position.id)} `)
    }

    return this._encodeCall({
      arguments: [
        {
          vaultId: params.position.id.vaultId,
          userAddress: params.positionsManager.address.value,
          amount: params.amount.toBaseUnit(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
