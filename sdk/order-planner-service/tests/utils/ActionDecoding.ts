import { BaseAction } from '@summerfi/order-planner-common/actions'
import { HexData } from '@summerfi/sdk-common/common'
import {
  decodeAbiParameters,
  decodeFunctionData,
  keccak256,
  parseAbi,
  parseAbiParameters,
  toBytes,
} from 'viem'

export const OperationExecutorSelector = '85e92d98'

export function getTargethash(action: BaseAction): string {
  return keccak256(toBytes(action.getVersionedName()))
}

export function decodeActionCalldata(
  action: BaseAction,
  calldata: HexData | string,
):
  | {
      args: readonly unknown[]
      mapping: number[]
    }
  | undefined {
  const opExecutorAbiSpec = [
    'function execute(bytes calldata data, uint8[] paramsMap) external payable returns (bytes calldata)',
  ]

  const opExecutorAbi = parseAbi(opExecutorAbiSpec)

  const decoded = decodeFunctionData({
    abi: opExecutorAbi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  const actionAbi = parseAbiParameters(action.config.parametersAbi)

  const decodedActionArgs = decodeAbiParameters(actionAbi, decoded.args[0] as HexData)

  return {
    args: decodedActionArgs,
    mapping: decoded.args[1] as number[],
  }
}
