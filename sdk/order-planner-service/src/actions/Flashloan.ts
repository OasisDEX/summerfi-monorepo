import { ActionCall } from '~orderplanner/interfaces/Action'
import { BaseAction } from './BaseAction'
import { TokenAmount } from '@summerfi/sdk/common'
import { encodeAction } from '~orderplanner/utils/EncodeAction'
import { FlashloanProvider } from '~orderplanner/interfaces/Types'

type OptionalActionCall = ActionCall & {
  skipped: boolean
}

export class Flashloan extends BaseAction {
  constructor() {
    super(
      'TakeFlashloan',
      1,
      'uint256, address, bool, bool, uint8, (bytes32 targetHash, bytes callData, bool skipped)[]',
    )
  }

  public encode(params: {
    amount: TokenAmount
    provider: FlashloanProvider
    calls: ActionCall[]
  }): ActionCall {
    const calls: OptionalActionCall[] = params.calls.map((call) => {
      return {
        targetHash: call.targetHash,
        callData: call.callData,
        skipped: false,
      }
    })

    return encodeAction(`${this.name}_v${this.version}`, this.parametersAbi, [
      params.amount.toString(),
      params.amount.token.address.hexValue,
      true,
      true,
      calls,
    ])
  }
}
