import { ActionCall } from '~orderplanner/interfaces/Action'
import { BaseAction } from './BaseAction'
import { TokenAmount } from '@summerfi/sdk-common/common'

// Local type as optional actions are not supported anymore in the new executor
type OptionalActionCall = ActionCall & {
  skipped: boolean
}

export class FlashloanAction extends BaseAction {
  constructor() {
    super({
      name: 'TakeFlashloan',
      version: 1,
      parametersAbi:
        'uint256, address, bool, bool, uint8, (bytes32 targetHash, bytes callData, bool skipped)[]',
    })
  }

  public encodeCall(params: {
    amount: TokenAmount
    provider: number
    calls: ActionCall[]
  }): ActionCall {
    const calls: OptionalActionCall[] = params.calls.map((call) => {
      return {
        targetHash: call.targetHash,
        callData: call.callData,
        skipped: false,
      }
    })

    return this._encodeCall([
      params.amount.toString(),
      params.amount.token.address.hexValue,
      true,
      true,
      calls,
    ])
  }
}
