import { HexData } from '@summerfi/sdk-common/common/aliases'
import { encodeFunctionData, parseAbi } from 'viem'
import { ActionCall } from '../actions/Types'

export function encodeStrategy(strategyName: string, actions: ActionCall[]): HexData {
  const abi = parseAbi(['function executeOp(Call[] memory calls, string calldata operationName)'])

  return encodeFunctionData({
    abi,
    functionName: 'executeOp',
    args: [actions, strategyName],
  })
}
