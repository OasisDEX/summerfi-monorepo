import { AddressValue } from '@summerfi/sdk-common'
import { HexData } from '@summerfi/sdk-common'
import { decodeFunctionData, parseAbi } from 'viem'

export function decodeAllowanceCalldata(calldata: HexData | string) {
  const abi = parseAbi([
    'function approve(address spender, uint256 amount) external returns (bool)',
  ])

  const decoded = decodeFunctionData({
    abi: abi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  return {
    spender: decoded.args[0] as AddressValue,
    amount: decoded.args[1],
  }
}
