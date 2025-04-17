import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IToken } from '@summerfi/sdk-common'

export class ReturnFundsAction extends BaseAction<typeof ReturnFundsAction.Config> {
  static Config = {
    name: 'ReturnFunds',
    version: 3,
    parametersAbi: ['(address asset)'],
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

  public get config() {
    return ReturnFundsAction.Config
  }
}
