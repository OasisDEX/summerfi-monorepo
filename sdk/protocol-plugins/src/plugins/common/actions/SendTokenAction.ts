import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class SendTokenAction extends BaseAction {
  public readonly config = {
    name: 'SendToken',
    version: 4,
    parametersAbi: '(address asset, address to, uint256 amount)',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { sendAmount: TokenAmount; sendTo: Address },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.sendAmount.token.address.value,
          to: params.sendTo.value,
          amount: params.sendAmount.toBaseUnit(),
        },
      ],
      mapping: paramsMapping,
    })
  }
}
