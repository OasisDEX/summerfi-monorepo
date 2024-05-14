import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IToken } from '@summerfi/sdk-common/common'

export class ReturnFundsAction extends BaseAction {
  public readonly config = {
    name: 'ReturnFunds',
    version: 3,
    parametersAbi: '(address asset)',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(params: { asset: IToken }, paramsMapping?: InputSlotsMapping): ActionCall {
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
