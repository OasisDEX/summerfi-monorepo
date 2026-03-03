import {
  getChainInfoByChainId,
  type AddressValue,
  type ChainId,
  type HexData,
  type TransactionInfo,
} from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export type SendTransactionTool = ReturnType<typeof createSendTransactionTool>
export type SendTransactionToolStatus = 'success' | 'reverted'

export const createSendTransactionTool = (params: {
  chainId: ChainId
  rpcUrl: string
  senderAddress: AddressValue
  signerPrivateKey?: HexData
  simulateOnly?: boolean
}) => {
  const { chainId, rpcUrl, signerPrivateKey, senderAddress } = params
  const simulateOnly = signerPrivateKey == null ? true : params.simulateOnly ?? true

  if (signerPrivateKey != null && !isHex(signerPrivateKey)) {
    throw new Error('Signer privateKey is not a hex string')
  }
  if (!rpcUrl) {
    throw new Error('rpcUrl is not set')
  }

  const useFork = process.env.SDK_USE_FORK === 'true'
  // Branch TransactionUtils construction based on signerPrivateKey presence
  // If signerPrivateKey is present, construct with walletPrivateKey for send/sendSimulation
  // Otherwise, construct simulation-only TransactionUtils without walletPrivateKey
  // so sendSimulation can run without requiring an account
  const transactionUtils = signerPrivateKey
    ? new TransactionUtils({
        rpcUrl,
        walletPrivateKey: signerPrivateKey,
        chainInfo: getChainInfoByChainId(chainId),
        useFork: useFork ? true : false,
      })
    : new TransactionUtils({
        rpcUrl,
        chainInfo: getChainInfoByChainId(chainId),
        useFork: useFork ? true : false,
      })

  return async <T extends TransactionInfo | TransactionInfo[]>(
    transactionOrTransactions: T,
    { confirmations = 1 }: { confirmations?: number } = {},
  ): Promise<
    T extends TransactionInfo ? SendTransactionToolStatus : SendTransactionToolStatus[]
  > => {
    const statuses: SendTransactionToolStatus[] = []

    const transactions = Array.isArray(transactionOrTransactions)
      ? transactionOrTransactions
      : [transactionOrTransactions]
    if (transactions.length === 0) {
      throw new Error('No transactions to send')
    }

    for (const [index, transaction] of transactions.entries()) {
      console.log(
        `# Tx ${useFork ? 'on fork' : ''} ${index + 1}: `,
        transaction.description,
        // rpcUrl,
      )

      // Simulate the transaction
      try {
        const res = await transactionUtils.sendSimulation({
          transaction: transaction.transaction,
          senderAddress,
        })
        console.log('  > Simulation successful' + (res.data ? `, with result: ${res.data}` : ''))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        debugViemError('  > Simulation failed with error:', error)
        throw new Error('Transaction simulation failed')
      }

      // Send the transaction
      if (simulateOnly === false) {
        try {
          const receipt = await transactionUtils.sendTransactionWithReceipt({
            transaction: transaction.transaction,
            confirmations,
          })
          console.log('  > Sending successful with hash: ' + receipt.transactionHash)
          statuses.push(receipt.status)
        } catch (error) {
          debugViemError('  > Sending failed with error:', error)
          statuses.push('reverted')
        }
      }
    }

    console.log('  > Done', statuses)
    return (
      Array.isArray(transactionOrTransactions) ? statuses : statuses[0]
    ) as T extends TransactionInfo ? SendTransactionToolStatus : SendTransactionToolStatus[]
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debugViemError(msg: string, error: any) {
  console.error(msg, error.shortMessage)
  console.log('Transaction data:', error.metaMessages)
}
