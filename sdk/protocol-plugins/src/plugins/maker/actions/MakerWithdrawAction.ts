import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { IPool, isMakerPoolId } from '@summerfi/sdk-common/protocols'

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
      pool: IPool
      positionsManager: IPositionsManager
      amount: TokenAmount
      joinAddress: Address
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    if (!isMakerPoolId(params.pool.poolId)) {
      throw new Error('Pool ID is not a Maker one')
    }

    return this._encodeCall({
      arguments: [
        {
          vaultId: params.pool.poolId.vaultId,
          userAddress: params.positionsManager.address.value,
          joinAddr: params.joinAddress.value,
          amount: params.amount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
