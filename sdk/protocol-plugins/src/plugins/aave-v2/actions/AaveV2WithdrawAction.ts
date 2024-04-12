import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPool, isAaveV2PoolId } from '@summerfi/sdk-common/protocols'

export class AaveV2WithdrawAction extends BaseAction {
  public readonly config = {
    name: 'AaveV2Withdraw',
    version: 1,
    parametersAbi: '/** INSERT HERE - THE ACTION PARAMETERS **/',
    storageInputs: [/** INSERT HERE - THE STORAGE INPUTS **/],
    storageOutputs: [/** INSERT HERE - THE STORAGE OUTPUTS **/],
  } as const

  public encodeCall(
    params: {
        /** INSERT HERE - THE ACTION PARAMETERS **/
    },
    paramsMapping?: number[],
  ): ActionCall {
    if (!isAaveV2PoolId(params.pool.poolId)) {
      throw new Error('Pool ID is not a AaveV2 one')
    }

    return this._encodeCall({
      arguments: [
        /** INSERT HERE - THE ACTION ARGS  **/
      ],
      mapping: paramsMapping,
    })
  }
}
