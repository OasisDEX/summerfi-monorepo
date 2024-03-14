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

  public encodeCall(
    params: {
      pool: IPool
      userAddress: Address
      amount: TokenAmount
      joinAddress: Address
    },
    paramsMapping?: number[],
  ): ActionCall {
    if (!isMakerPoolId(params.pool.poolId)) {
      throw new Error('Pool ID is not a Maker one')
    }

    // TODO: get the join address from the protocol
    return this._encodeCall({
      arguments: [
        params.pool.poolId.vaultId,
        params.userAddress.value,
        params.joinAddress.value,
        params.amount.toBaseUnit(),
      ],
      mapping: paramsMapping,
    })
  }
}
