import { ActionCall, BaseAction } from '~orderplanner/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { Pool } from '@summerfi/sdk-common/protocols'

export class MakerWithdrawAction extends BaseAction {
  public readonly config = {
    name: 'MakerWithdraw',
    version: 1,
    parametersAbi: 'uint256 vaultId, address userAddress, address joinAddr, uint256 amount',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountWithdrawn'],
  } as const

  public encodeCall(params: { pool: Pool; userAddress: Address; amount: TokenAmount }): ActionCall {
    // TODO: get the join address form the protocol

    return this._encodeCall([
      params.pool.poolId.id,
      params.userAddress.toString(),
      // joinAddr,
      params.amount.toBaseUnit(),
    ])
  }
}
