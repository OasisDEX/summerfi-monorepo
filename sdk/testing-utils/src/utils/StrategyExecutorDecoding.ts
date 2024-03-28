import { ActionCall } from '@summerfi/protocol-plugins-common'
import { HexData } from '@summerfi/sdk-common/common'
import { decodeFunctionData, parseAbi } from 'viem'

export type SkippableActionCall = ActionCall & {
  skipped: boolean
}

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

  const actionCalls: ActionCall[] = (decoded.args[0] as SkippableActionCall[]).map(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    ({ skipped, ...rest }) => rest,
  )

  return {
    actionCalls,
    strategyName: decoded.args[1] as string,
  }
}
