import { encodeFunctionData, parseAbi } from 'viem'
import { ActionCall } from '~orderplanner/interfaces'

export function encodeStrategy(strategyName: string, actions: ActionCall[]): string {
  const abi = parseAbi(['function executeOp(Call[] memory calls, string calldata operationName)'])

  return encodeFunctionData({
    abi,
    functionName: 'executeOp',
    args: [actions, strategyName],
  })
}
