import { Hex, encodeFunctionData, parseAbi } from 'viem'

export function encodeMakerProxyActionsGive(params: {
  cdpManager: Hex
  cdpId: string
  to: Hex
}): Hex {
  const abi = parseAbi(['function give(address cdpManager, uint256 cdpId, address to)'])

  return encodeFunctionData({
    abi,
    functionName: 'give',
    args: [params.cdpManager, BigInt(params.cdpId), params.to],
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
  makerProxyActions: Hex
  cdpManager: Hex
  cdpId: string
  to: Hex
}): {
  transactionCalldata: Hex
  dsProxyParameters: {
    target: Hex
    callData: Hex
  }
} {
  const makerGiveCalldata = encodeMakerProxyActionsGive(params)
  const transactionCalldata = encodeDsProxyExecute({
    target: params.makerProxyActions,
    callData: makerGiveCalldata,
  })

  return {
    transactionCalldata,
    dsProxyParameters: {
      target: params.makerProxyActions,
      callData: makerGiveCalldata,
    },
  }
}
