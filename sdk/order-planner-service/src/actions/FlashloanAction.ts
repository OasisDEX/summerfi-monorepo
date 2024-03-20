import { ActionCall, BaseAction } from '@summerfi/order-planner-common/actions'
import { TokenAmount } from '@summerfi/sdk-common/common'
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
      'uint256 amount, address asset, bool isProxyFlashloan, bool isDPMProxy, uint8 provider, (bytes32 targetHash, bytes callData, bool skipped)[] calls',

    storageInputs: [],
    storageOutputs: [],
  } as const

  public encodeCall(
    params: {
      amount: TokenAmount
      provider: FlashloanProvider
      calls: ActionCall[]
    },
    paramsMapping?: number[],
  ): ActionCall {
    const calls: OptionalActionCall[] = params.calls.map((call) => {
      return {
        targetHash: call.targetHash,
        callData: call.callData,
        skipped: false,
      }
    })

    return this._encodeCall({
      arguments: [
        params.amount.toBaseUnit(),
        params.amount.token.address.value,
        true,
        true,
        params.provider,
        calls,
      ],
      mapping: paramsMapping,
    })
  }
}
