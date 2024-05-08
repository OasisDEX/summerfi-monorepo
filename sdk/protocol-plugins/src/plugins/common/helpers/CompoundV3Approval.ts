import { Address, AddressValue } from '@summerfi/sdk-common/common'
import { ExternalPositionType, Transaction } from '@summerfi/sdk-common/orders'
import { cometAbi } from '../../compound-v3/abis/CompoundV3ABIS'
import { Hex, encodeFunctionData, parseAbi } from 'viem'

/**
 * Encodes a Compound V3 approval.
 *
 * @param params - The parameters for the approval.
 * @param params.manager - The address of the manager.
 * @param params.comet - The address of the comet.
 * @param params.source - The source of the approval, which can be a wallet or a DS proxy.
 * @param params.sourceAddress - The address of the source.
 *
 * @returns A transaction object that includes the target address, the calldata for the approval, and the value of the approval.
 *
 * @throws Will throw an error if the source is not a wallet or a DS proxy.
 */
export function encodeCompoundV3Allow(params: {
  positionsManager: AddressValue
  comet: AddressValue
  source: ExternalPositionType
  sourceAddress: AddressValue
}): Transaction {
  if (params.source == ExternalPositionType.WALLET) {
    const transactionCalldata = encodeFunctionData({
      abi: cometAbi,
      functionName: 'allow',
      args: [params.positionsManager, true],
    })
    return {
      target: Address.createFromEthereum({ value: params.comet }),
      calldata: transactionCalldata,
      value: '0',
    }
  } else if (params.source == ExternalPositionType.DS_PROXY) {
    // todo: requires proxy actions
    throw new Error('Not implemented yet')
  } else {
    throw new Error('Unsupported source')
  }
}

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
