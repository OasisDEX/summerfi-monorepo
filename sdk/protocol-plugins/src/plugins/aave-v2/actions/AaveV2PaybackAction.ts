import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'
import { IPool } from '@summerfi/sdk-common/protocols'
import { isAaveV2PoolId } from '@summerfi/sdk-common/protocols/'

export class AaveV2PaybackAction extends BaseAction {
  public readonly config = {
    name: 'AaveV2Payback',
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
