import { HexData } from '@summerfi/sdk-common/common/aliases'
import { encodeFunctionData, parseAbi } from 'viem'
import { ActionCall } from '../actions/Types'

type SkippableActionCall = ActionCall & {
  skipped: boolean
}

export function encodeStrategy(strategyName: string, actions: ActionCall[]): HexData {
  const abi = parseAbi([
    'function executeOp(Call[] memory calls, string calldata operationName)',
    'struct Call { bytes32 targetHash; bytes callData; bool skipped; }',
  ])

  // TODO: Hiding this here for now as we don't support skippable actions anymore in the new version
  const skippableActions: SkippableActionCall[] = actions.map((action) => ({
    ...action,
    skipped: false,
  }))

  return encodeFunctionData({
    abi,
    functionName: 'executeOp',
    args: [skippableActions, strategyName],
  })
}
