import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPool, isMakerPoolId } from '@summerfi/sdk-common/protocols'

export class MakerWithdrawAction extends BaseAction {
  public readonly config = {
    name: 'MakerWithdraw',
    version: 1,
    parametersAbi: 'uint256 vaultId, address userAddress, address joinAddr, uint256 amount',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(params: {
    pool: IPool
    userAddress: Address
    amount: TokenAmount
  }): ActionCall {
    // TODO: get the join address from the protocol

    if (!isMakerPoolId(params.pool.poolId)) {
      throw new Error('Pool ID is not a Maker one')
    }

    return this._encodeCall([
      // TODO: get vaultId by other means prev - params.pool.poolId.vaultId,
      0,
      params.userAddress.toString(),
      // joinAddr,
      params.amount.toBaseUnit(),
    ])
  }
}
