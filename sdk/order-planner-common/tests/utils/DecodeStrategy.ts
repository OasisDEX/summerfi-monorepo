import { HexData } from '@summerfi/sdk-common/common'
import { ActionCall } from '../../src/actions/Types'
import { decodeFunctionData, parseAbi } from 'viem'

type SkippableActionCall = ActionCall & {
  skipped: boolean
}

export function decodeStrategy(calldata: HexData): {
  strategyName: string
  actions: ActionCall[]
} {
  const abi = parseAbi(['function executeOp(Call[] memory calls, string calldata operationName)'])

  const args = decodeFunctionData({
    abi,
    data: calldata,
  })

  const nonSkippableActions = (args.args[0] as SkippableActionCall[]).map((action) => {
    const { skipped, ...rest } = action
    return rest
  })

  return {
    strategyName: args.args[1] as string,
    actions: nonSkippableActions,
  }
}
