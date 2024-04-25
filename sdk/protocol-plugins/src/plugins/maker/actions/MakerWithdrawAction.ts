import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { IPosition } from '@summerfi/sdk-common'
import { isMakerPositionId } from '../interfaces'

export class MakerWithdrawAction extends BaseAction {
  public readonly config = {
    name: 'MakerWithdraw',
    version: 0,
    parametersAbi: '(uint256 vaultId, address userAddress, address joinAddr, uint256 amount)',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(
    params: {
      position: IPosition
      positionsManager: IPositionsManager
      amount: TokenAmount
      joinAddress: Address
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    if (!isMakerPositionId(params.position.id)) {
      throw new Error('Pool ID is not a Maker one')
    }

    return this._encodeCall({
      arguments: [
        {
          vaultId: params.position.id.vaultId,
          userAddress: params.positionsManager.address.value,
          joinAddr: params.joinAddress.value,
          amount: params.amount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
