import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

export class PullTokenAction extends BaseAction<typeof PullTokenAction.Config> {
  public static readonly Config = {
    name: 'PullToken',
    version: 3,
    parametersAbi: ['(address asset, address from, uint256 amount)'],
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: { pullAmount: ITokenAmount; pullFrom: IAddress },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.pullAmount.token.address.value,
          from: params.pullFrom.value,
          amount: params.pullAmount.toSolidityValue(),
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return PullTokenAction.Config
  }
}
