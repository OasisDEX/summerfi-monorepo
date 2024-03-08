import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPool } from '@summerfi/sdk-common/protocols'
import { isMakerPoolId } from '@summerfi/sdk-common/protocols/'

export class MakerPaybackAction extends BaseAction {
  public readonly config = {
    name: 'MakerPayback',
    version: 1,
    parametersAbi: 'uint256 vaultId, address userAddress, uint256 amount, bool paybackAll',
    storageInputs: ['vaultId'],
    storageOutputs: ['amountPaidBack'],
  } as const

  public encodeCall(
    params: {
      pool: IPool
      userAddress: Address
      amount: TokenAmount
      paybackAll: boolean
    },
    paramsMapping?: number[],
  ): ActionCall {
    if (!isMakerPoolId(params.pool.poolId)) {
      throw new Error('Pool ID is not a Maker one')
    }

    return this._encodeCall({
      arguments: [
        params.pool.poolId.vaultId,
        params.userAddress.toString(),
        params.amount.toBaseUnit(),
        params.paybackAll,
      ],
      mapping: paramsMapping,
    })
  }
}
