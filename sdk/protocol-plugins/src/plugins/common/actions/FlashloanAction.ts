import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount } from '@summerfi/sdk-common/common'
import { FlashloanProvider } from '@summerfi/sdk-common/simulation'

// Local type as optional actions are not supported anymore in the new executor
type OptionalActionCall = ActionCall & {
  skipped: boolean
}

export class FlashloanAction extends BaseAction {
  public readonly config = {
    name: 'TakeFlashloan',
    version: 3,
    parametersAbi:
      '(uint256 amount, address asset, bool isProxyFlashloan, bool isDPMProxy, uint8 provider, (bytes32 targetHash, bytes callData, bool skipped)[] calls)',
    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: {
      amount: ITokenAmount
      provider: FlashloanProvider
      calls: ActionCall[]
    },
    paramsMapping?: InputSlotsMapping,
  ): ActionCall {
    const calls: OptionalActionCall[] = params.calls.map((call) => {
      return {
        name: call.name,
        targetHash: call.targetHash,
        callData: call.callData,
        skipped: false,
      }
    })

    return this._encodeCall({
      arguments: [
        {
          amount: params.amount.toBaseUnit(),
          asset: params.amount.token.address.value,
          isProxyFlashloan: true,
          isDPMProxy: true,
          provider: params.provider,
          calls: calls,
        },
      ],
      mapping: paramsMapping,
    })
  }
}
