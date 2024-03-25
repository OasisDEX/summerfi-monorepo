import { ActionCall } from '@summerfi/protocol-plugins-common'
import { Address } from '@summerfi/sdk-common/common'
import { HexData } from '@summerfi/sdk-common/common/aliases'
import { encodeFunctionData, parseAbi } from 'viem'

type SkippableActionCall = ActionCall & {
  skipped: boolean
}

function encodeForExecutor(params: { strategyName: string; actions: ActionCall[] }): HexData {
  const { strategyName, actions } = params

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

export function encodeForPositionsManager(params: { target: Address; data: HexData }): HexData {
  const { target, data } = params

  const abi = parseAbi(['function execute(address _target, bytes memory _data)'])

  return encodeFunctionData({
    abi,
    functionName: 'execute',
    args: [target.value, data],
  })
}

export function encodeStrategy(params: {
  strategyName: string
  strategyExecutor: Address
  actions: ActionCall[]
}): HexData {
  const { strategyName, strategyExecutor, actions } = params

  const executorData = encodeForExecutor({ strategyName, actions })

  return encodeForPositionsManager({
    target: strategyExecutor,
    data: executorData,
  })
}
