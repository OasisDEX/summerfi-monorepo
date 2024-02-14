import { ActionCall } from '~orderplanner/interfaces'
import {
  parseAbi,
  encodeFunctionData,
  encodeAbiParameters,
  parseAbiParameters,
  keccak256,
  toBytes,
} from 'viem'

export function encodeAction(
  contractNameWithVersion: string,
  parametersAbi: string,
  args: unknown[],
  paramsMapping: number[] = [],
): ActionCall {
  const targetHash = keccak256(toBytes(contractNameWithVersion))

  const abi = parseAbi([
    'function execute(bytes calldata data, uint8[] paramsMap) external payable returns (bytes calldata)',
  ])

  const encodedArgs = encodeAbiParameters(parseAbiParameters(parametersAbi), args)

  const calldata = encodeFunctionData({
    abi,
    functionName: 'execute',
    args: [encodedArgs, paramsMapping],
  })

  return {
    targetHash,
    callData: calldata,
  }
}
