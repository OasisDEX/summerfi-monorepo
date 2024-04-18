import { AddressValue } from '@summerfi/sdk-common/common'
import { Hex, encodeFunctionData, parseAbi } from 'viem'

export function encodeMakerProxyActionsGive(params: {
  cdpManagerAddress: AddressValue
  cdpId: string
  giveToAddress: AddressValue
}): Hex {
  const abi = parseAbi(['function give(address cdpManager, uint256 cdpId, address to)'])

  return encodeFunctionData({
    abi,
    functionName: 'give',
    args: [params.cdpManagerAddress, BigInt(params.cdpId), params.giveToAddress],
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

export function encodeMakerGiveThroughProxyActions(params: {
  makerProxyActionsAddress: AddressValue
  cdpManagerAddress: AddressValue
  cdpId: string
  giveToAddress: AddressValue
}): {
  transactionCalldata: Hex
  dsProxyParameters: {
    target: Hex
    callData: Hex
  }
} {
  const makerGiveCalldata = encodeMakerProxyActionsGive(params)
  const transactionCalldata = encodeDsProxyExecute({
    target: params.makerProxyActionsAddress,
    callData: makerGiveCalldata,
  })

  return {
    transactionCalldata,
    dsProxyParameters: {
      target: params.makerProxyActionsAddress,
      callData: makerGiveCalldata,
    },
  }
}
