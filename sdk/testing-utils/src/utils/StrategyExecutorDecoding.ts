import { ActionCall } from '@summerfi/protocol-plugins-common'
import { HexData } from '@summerfi/sdk-common'
import { decodeFunctionData, parseAbi } from 'viem'

export function decodeStrategyExecutorCalldata(calldata: HexData | string):
  | {
      actionCalls: ActionCall[]
      strategyName: string
    }
  | undefined {
  const opExecutorAbi = parseAbi([
    'function executeOp(Call[] memory calls, string calldata operationName)',
    'struct Call { bytes32 targetHash; bytes callData; bool skipped; }',
  ])

  const decoded = decodeFunctionData({
    abi: opExecutorAbi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  return {
    actionCalls: decoded.args[0] as ActionCall[],
    strategyName: decoded.args[1] as string,
  }
}
