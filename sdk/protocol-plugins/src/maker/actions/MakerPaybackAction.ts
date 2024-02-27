import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common/implementation'
import { Pool } from '@summerfi/sdk-common/protocols'

export class MakerPaybackAction extends BaseAction {
  public readonly config = {
    name: 'MakerPayback',
    version: 1,
    parametersAbi: 'uint256 vaultId, address userAddress, uint256 amount, bool paybackAll',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(params: {
    pool: Pool
    userAddress: Address
    amount: TokenAmount
    paybackAll: boolean
  }): ActionCall {
    return this._encodeCall([
      params.pool.poolId.id,
      params.userAddress.toString(),
      params.amount.toBaseUnit(),
      params.paybackAll,
    ])
  }
}
