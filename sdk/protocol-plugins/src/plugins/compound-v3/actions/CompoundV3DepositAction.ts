import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { TokenAmount } from '@summerfi/sdk-common/common'

export class CompoundV3DepositAction extends BaseAction {
  public readonly config = {
    name: 'CompoundV3Deposit',
    version: 0,
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
    return this._encodeCall({
      arguments: [
        /** INSERT HERE - THE ACTION ARGS  **/
      ],
      mapping: paramsMapping,
    })
  }
}
