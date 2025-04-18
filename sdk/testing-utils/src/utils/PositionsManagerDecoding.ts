import { Address, AddressValue, HexData } from '@summerfi/sdk-common'
import { decodeFunctionData, parseAbi } from 'viem'

export function decodePositionsManagerCalldata(params: { calldata: HexData | string }):
  | {
      target: Address
      calldata: HexData
    }
  | undefined {
  const positionsManagerAbi = parseAbi(['function execute(address target, bytes callData)'])

  const decoded = decodeFunctionData({
    abi: positionsManagerAbi,
    data: params.calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  const target: Address = Address.createFromEthereum({ value: decoded.args[0] as AddressValue })
  const calldata: HexData = decoded.args[1] as HexData

  return {
    target,
    calldata,
  }
}
