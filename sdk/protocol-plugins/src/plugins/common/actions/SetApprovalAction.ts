import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { IAddress, ITokenAmount } from '@summerfi/sdk-common'

export class SetApprovalAction extends BaseAction<typeof SetApprovalAction.Config> {
  public static readonly Config = {
    name: 'SetApproval',
    version: 3,
    parametersAbi: ['(address asset, address delegate, uint256 amount, bool sumAmounts)'],
    storageInputs: ['asset', 'delegate', 'approvalAmount'],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: {
      approvalAmount: ITokenAmount
      delegate: IAddress
      sumAmounts: boolean
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    return this._encodeCall({
      arguments: [
        {
          asset: params.approvalAmount.token.address.value,
          delegate: params.delegate.value,
          amount: params.approvalAmount.toSolidityValue(),
          sumAmounts: params.sumAmounts,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return SetApprovalAction.Config
  }
}
