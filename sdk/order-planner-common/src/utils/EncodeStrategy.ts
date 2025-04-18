import { ActionCall } from '@summerfi/protocol-plugins-common'
import { Address, HexData, Maybe, IPositionsManager, TransactionInfo } from '@summerfi/sdk-common'
import { encodeFunctionData, parseAbi } from 'viem'

function encodeForExecutor(params: { strategyName: string; actions: ActionCall[] }): HexData {
  const { strategyName, actions } = params

  const abi = parseAbi([
    'function executeOp(Call[] memory calls, string calldata strategyName)',
    'struct Call { bytes32 targetHash; bytes callData; bool skipped; }',
  ])

  return encodeFunctionData({
    abi,
    functionName: 'executeOp',
    args: [actions, strategyName],
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
  positionsManager: IPositionsManager
  actions: ActionCall[]
}): Maybe<TransactionInfo> {
  const { strategyName, strategyExecutor, actions } = params

  if (actions.length == 0) {
    return undefined
  }

  const executorData = encodeForExecutor({ strategyName, actions })

  const calldata = encodeForPositionsManager({
    target: strategyExecutor,
    data: executorData,
  })

  return {
    transaction: {
      target: params.positionsManager.address,
      calldata: calldata,
      value: '0',
    },
    description: 'Strategy execution',
  }
}
