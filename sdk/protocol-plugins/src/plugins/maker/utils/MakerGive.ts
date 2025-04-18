import { AddressValue } from '@summerfi/sdk-common'
import { Hex, encodeFunctionData, parseAbi } from 'viem'

export function encodeMakerProxyActionsAllow(params: {
  cdpManagerAddress: AddressValue
  cdpId: string
  allowAddress: AddressValue
}): Hex {
  const abi = parseAbi([
    'function cdpAllow(address cdpManager, uint256 cdpId, address to, uint allow)',
  ])

  return encodeFunctionData({
    abi,
    functionName: 'cdpAllow',
    args: [params.cdpManagerAddress, BigInt(params.cdpId), params.allowAddress, 1n],
  })
}

export function encodeDsProxyExecute(params: { target: Hex; callData: Hex }): Hex {
  const abi = parseAbi(['function execute(address target, bytes calldata data)'])

  return encodeFunctionData({
    abi,
    functionName: 'execute',
    args: [params.target, params.callData],
  })
}

export function encodeMakerAllowThroughProxyActions(params: {
  makerProxyActionsAddress: AddressValue
  cdpManagerAddress: AddressValue
  cdpId: string
  allowAddress: AddressValue
}): {
  transactionCalldata: Hex
  dsProxyParameters: {
    target: Hex
    callData: Hex
  }
} {
  const makerAllowCalldata = encodeMakerProxyActionsAllow(params)
  const transactionCalldata = encodeDsProxyExecute({
    target: params.makerProxyActionsAddress,
    callData: makerAllowCalldata,
  })

  return {
    transactionCalldata,
    dsProxyParameters: {
      target: params.makerProxyActionsAddress,
      callData: makerAllowCalldata,
    },
  }
}
