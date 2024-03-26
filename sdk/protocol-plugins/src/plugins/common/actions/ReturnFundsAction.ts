import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Token } from '@summerfi/sdk-common/common'

export class ReturnFundsAction extends BaseAction {
  public readonly config = {
    name: 'ReturnFunds',
    version: 3,
    parametersAbi: '(address asset)',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(params: { asset: Token }, paramsMapping?: number[]): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.asset.address.value,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
