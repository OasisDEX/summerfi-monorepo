import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

export class SendTokenAction extends BaseAction<typeof SendTokenAction.Config> {
  public static readonly Config = {
    name: 'SendToken',
    version: 4,
    parametersAbi: ['(address asset, address to, uint256 amount)'],
    storageInputs: ['asset', 'to', 'amount'],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { sendAmount: ITokenAmount; sendTo: IAddress },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.sendAmount.token.address.value,
          to: params.sendTo.value,
          amount: params.sendAmount.toSolidityValue(),
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SendTokenAction.Config
  }
}
