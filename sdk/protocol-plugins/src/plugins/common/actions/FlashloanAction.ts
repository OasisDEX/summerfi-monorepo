import { ActionCall, BaseAction, InputSlotsMapping } from '@summerfi/protocol-plugins-common'
import { ITokenAmount, FlashloanProvider } from '@summerfi/sdk-common'

export class FlashloanAction extends BaseAction<typeof FlashloanAction.Config> {
  public static Config = {
    name: 'TakeFlashloan',
    version: 3,
    parametersAbi: [
      '(uint256 amount, address asset, bool isProxyFlashloan, bool isDPMProxy, uint8 provider, (bytes32 targetHash, bytes callData, bool skipped)[] calls)',
    ],
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
    return this._encodeCall({
      arguments: [
        {
          amount: params.amount.toSolidityValue(),
          asset: params.amount.token.address.value,
          isProxyFlashloan: true,
          isDPMProxy: true,
          provider: params.provider,
          calls: params.calls,
        },
      ],
      mapping: paramsMapping,
    })
  }

  public get config() {
    return FlashloanAction.Config
  }
}
