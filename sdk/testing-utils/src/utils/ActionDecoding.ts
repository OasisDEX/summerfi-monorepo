import { ActionConfig, BaseAction } from '@summerfi/protocol-plugins-common'
import { HexData } from '@summerfi/sdk-common'

import {
  decodeAbiParameters,
  decodeFunctionData,
  keccak256,
  parseAbi,
  parseAbiParameters,
  toBytes,
} from 'viem'

export function getTargetHash<Config extends ActionConfig>(action: BaseAction<Config>): string {
  return keccak256(toBytes(action.getVersionedName()))
}

export function decodeActionCalldata<Config extends ActionConfig>(params: {
  action: BaseAction<Config>
  calldata: HexData | string
}):
  | {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      args: readonly any[]
      mapping: number[]
    }
  | undefined {
  const { action, calldata } = params

  const actionExecuteAbiSpec = [
    'function execute(bytes calldata data, uint8[] paramsMap) external payable returns (bytes calldata)',
  ]

  const actionExecuteAbi = parseAbi(actionExecuteAbiSpec)

  const decoded = decodeFunctionData({
    abi: actionExecuteAbi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  const actionAbi = parseAbiParameters(action.config.parametersAbi as unknown as string)
  const decodedActionArgs = decodeAbiParameters(actionAbi, decoded.args[0] as HexData)

  return {
    args: decodedActionArgs,
    mapping: decoded.args[1] as number[],
  }
}
