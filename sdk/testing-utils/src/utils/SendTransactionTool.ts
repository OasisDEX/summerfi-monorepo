import { getChainInfoByChainId, type ChainId, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export type SendTransactionTool = ReturnType<typeof createSendTransactionTool>
export type SendTransactionToolStatus = 'success' | 'reverted'

export const createSendTransactionTool = (params: {
  chainId: ChainId
  rpcUrl: string
  signerPrivateKey: string
  simulateOnly?: boolean
}) => {
  const signerPrivateKey = params.signerPrivateKey
  const simulateOnly = params.simulateOnly ?? true

  if (!isHex(signerPrivateKey)) {
    throw new Error('Signer privateKey is not a hex string')
  }
  const rpcUrl = params.rpcUrl
  if (!rpcUrl) {
    throw new Error('rpcUrl is not set')
  }

  const useFork = process.env.SDK_USE_FORK === 'true'
  const transactionUtils = new TransactionUtils({
    rpcUrl: rpcUrl,
    walletPrivateKey: signerPrivateKey,
    chainInfo: getChainInfoByChainId(params.chainId),
    useFork: useFork ? true : false,
  })

  return async <T extends TransactionInfo | TransactionInfo[]>(
    transactionOrTransactions: T,
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
        })
        console.log('  > Simulation successful' + (res.data ? `, with result: ${res.data}` : ''))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        debugViemError('  > Simulation failed with error:', error)
        continue
      }

      // Send the transaction
      if (simulateOnly === false) {
        try {
          const receipt = await transactionUtils.sendTransactionWithReceipt({
            transaction: transaction.transaction,
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
