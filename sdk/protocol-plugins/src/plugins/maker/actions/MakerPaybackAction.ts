import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'
import { IPositionsManager } from '@summerfi/sdk-common/orders'
import { IPool, isMakerPoolId } from '@summerfi/sdk-common/protocols/'

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
      pool: IPool
      positionsManager: IPositionsManager
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
        {
          vaultId: params.pool.poolId.vaultId,
          userAddress: params.positionsManager.address.value,
          amount: params.amount.toBaseUnit(),
          paybackAll: params.paybackAll,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
