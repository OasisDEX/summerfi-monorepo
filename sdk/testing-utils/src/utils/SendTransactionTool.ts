import { IChainInfo, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export type SendTransactionTool = ReturnType<typeof createSendTransactionTool>

export const createSendTransactionTool = (params: {
  chainInfo: IChainInfo
  rpcUrl: string
  signerPrivateKey: string
  onlySimulation?: boolean
}) => {
  const signerPrivateKey = params.signerPrivateKey

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
    chainInfo: params.chainInfo,
    useFork: useFork ? true : false,
  })

  return async <T extends TransactionInfo | TransactionInfo[]>(
    transactionOrTransactions: T,
  ): Promise<T extends TransactionInfo ? string : string[]> => {
    const statuses: string[] = []

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

      try {
        const res = await transactionUtils.sendSimulation({
          transaction: transaction.transaction,
        })
        console.log('  > Simulation successful' + (res.data ? `, with result: ${res.data}` : ''))
      } catch (error) {
        console.error('  > Simulation failed with error:', error)
      }

      if (!params.onlySimulation) {
        try {
          const receipt = await transactionUtils.sendTransactionWithReceipt({
            transaction: transaction.transaction,
          })
          console.log('  > Sending successful with hash: ' + receipt.transactionHash)
          statuses.push(receipt.status)
        } catch (error) {
          console.error('  > Sending failed with error:', error)
          statuses.push('failed')
        }
      }
    }

    console.log('  > Done', statuses)
    return (
      Array.isArray(transactionOrTransactions) ? statuses : statuses[0]
    ) as T extends TransactionInfo ? string : string[]
  }
}
