import { AddressValue } from '@summerfi/sdk-common'
import { HexData } from '@summerfi/sdk-common'
import { decodeFunctionData, parseAbi } from 'viem'

export function decodeFleetDepositCalldata(calldata: HexData | string):
  | {
      assets: bigint
      receiver: AddressValue
    }
  | undefined {
  const fleetCommanderAbi = parseAbi(['function deposit(uint256 assets, address receiver)'])

  const decoded = decodeFunctionData({
    abi: fleetCommanderAbi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  return {
    assets: decoded.args[0],
    receiver: decoded.args[1] as AddressValue,
  }
}

export function decodeFleetWithdrawCalldata(calldata: HexData | string):
  | {
      assets: bigint
      receiver: AddressValue
      owner: AddressValue
    }
  | undefined {
  const fleetCommanderAbi = parseAbi([
    'function withdraw(uint256 assets, address receiver, address owner)',
  ])

  const decoded = decodeFunctionData({
    abi: fleetCommanderAbi,
    data: calldata as HexData,
  })

  if (!decoded || !decoded.args) {
    return undefined
  }

  return {
    assets: decoded.args[0],
    receiver: decoded.args[1] as AddressValue,
    owner: decoded.args[2] as AddressValue,
  }
}
