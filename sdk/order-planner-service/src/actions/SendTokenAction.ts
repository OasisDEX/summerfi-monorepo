import { ActionCall, BaseAction } from '@summerfi/protocol-plugins-common'
import { Address, TokenAmount } from '@summerfi/sdk-common/common'

export class SendTokenAction extends BaseAction {
  public readonly config = {
    name: 'SendToken',
    version: 1,
    parametersAbi: 'address asset, address to, uint256 amount',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { sendAmount: TokenAmount; sendTo: Address },
    paramsMapping?: number[],
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        params.sendAmount.token.address.value,
        params.sendTo.value,
        params.sendAmount.toBaseUnit(),
      ],
      mapping: paramsMapping,
    })
  }
}
