import { Address, AddressValue, TokenAmount } from '@summerfi/sdk-common/common'
import { ExternalPositionType, Transaction } from '@summerfi/sdk-common/orders'
import { Hex, encodeFunctionData, parseAbi } from 'viem'

/**
 * Encodes an ERC20 token transfer.
 *
 * @param params - The parameters for the token transfer.
 * @param params.tokenAddress - The address of the ERC20 token to transfer.
 * @param params.transferTo - The address to transfer the token to.
 * @param params.transferAmount - The amount of token to transfer.
 * @param params.source - The source of the transfer, which can be a wallet, a DS proxy, a little froggy, or a safe.
 * @param params.sourceAddress - The address of the source.
 *
 * @returns A transaction object that includes the target address, the calldata for the transfer, and the value of the transfer.
 *
 * @throws Will throw an error if the source is not a wallet or a DS proxy.
 */
export function encodeERC20Transfer(params: {
  tokenAddress: AddressValue
  transferTo: AddressValue
  transferAmount: TokenAmount
  source: ExternalPositionType
  sourceAddress: AddressValue
}): Transaction {
  if (params.source == ExternalPositionType.WALLET) {
    const transactionCalldata = encodeTransfer({
      target: params.transferTo,
      amount: params.transferAmount,
    })
    return {
      target: Address.createFromEthereum({ value: params.tokenAddress }),
      calldata: transactionCalldata,
      value: '0',
    }
  } else if (params.source == ExternalPositionType.DS_PROXY) {
    const transferCalldata = encodeTransferThroughProxyActions({
      token: params.tokenAddress,
      target: params.transferTo,
      amount: params.transferAmount,
    })

    const transactionCalldata = encodeDsProxyExecute({
      target: params.sourceAddress, // TODO: proxy actions address
      callData: transferCalldata,
    })

    return {
      target: Address.createFromEthereum({ value: params.sourceAddress }),
      calldata: transactionCalldata,
      value: '0',
    }
  } else {
    throw new Error('Unsupported source')
  }
  //   if (params.source == ExternalPositionType.LITTLE_FROGGY) {
  //   }
  //   if (params.source == ExternalPositionType.SAFE) {
  //   }
}
/**
 * Encodes an ERC20 token transfer from EOA.
 *
 * @param params - The parameters for the token transfer.
 * @param params.target - The address to transfer the token to.
 * @param params.amount - The amount of token to transfer.
 *
 * @returns The encoded function data for the token transfer.
 */
export function encodeTransfer(params: { target: AddressValue; amount: TokenAmount }): Hex {
  const abi = parseAbi(['function transfer(address to, uint256 value)'])

  return encodeFunctionData({
    abi,
    functionName: 'transfer',
    args: [params.target, BigInt(params.amount.toBaseUnit())],
  })
}

export function encodeTransferThroughProxyActions(params: {
  token: AddressValue
  target: AddressValue
  amount: TokenAmount
}): Hex {
  const abi = parseAbi(['function transfer(address token, address to, uint256 value)'])

  return encodeFunctionData({
    abi,
    functionName: 'transfer',
    args: [params.token, params.target, BigInt(params.amount.toBaseUnit())],
  })
}

// /*
// TBD */
// export function encodeTransferThroughDSAConnector(params: {
//   token: AddressValue
//   target: AddressValue
//   amount: TokenAmount
// }): Hex {
//   // not implemented
// }
// export function encodeTransferThroughSafe(params: {
//   token: AddressValue
//   target: AddressValue
//   amount: TokenAmount
// }): Hex {
//   // not implemented
// }

/**
 * Encodes a DS Proxy execution.
 *
 * @param params - The parameters for the DS Proxy execution.
 * @param params.target - The target address for the execution.
 * @param params.callData - The calldata for the execution.
 *
 * @returns The encoded function data for the DS Proxy execution.
 */
export function encodeDsProxyExecute(params: { target: Hex; callData: Hex }): Hex {
  const abi = parseAbi(['function execute(address target, bytes calldata data)'])

  return encodeFunctionData({
    abi,
    functionName: 'execute',
    args: [params.target, params.callData],
  })
}
