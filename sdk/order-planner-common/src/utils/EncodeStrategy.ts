import { Hex, encodeFunctionData, parseAbi } from 'viem'
import { ActionCall } from '~orderplannercommon/actions'

export function encodeStrategy(strategyName: string, actions: ActionCall[]): Hex {
  const abi = parseAbi(['function executeOp(Call[] memory calls, string calldata operationName)'])

  return encodeFunctionData({
    abi,
    functionName: 'executeOp',
    args: [actions, strategyName],
  })
}
