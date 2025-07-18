import { IChainInfo, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export async function sendAndLogTransactions(params: {
  chainInfo: IChainInfo
  transactions: TransactionInfo[]
  rpcUrl: string
  privateKey: string
  simulateOnly?: boolean
}) {
  const privateKey = params.privateKey
  if (!privateKey) {
    throw new Error('Sender privateKey not set')
  }
  if (!isHex(privateKey)) {
    throw new Error('Sender privateKey is not a hex string')
  }
  const rpcUrl = params.rpcUrl
  if (!rpcUrl) {
    throw new Error('forkUrl or rpcUrl must be set')
  }

  const useFork = process.env.SDK_USE_FORK === 'true'

  // console.log('transactions', params.transactions)

  const statuses: string[] = []

  for (const [index, transaction] of params.transactions.entries()) {
    console.log(
      `Sending transaction ${useFork ? 'using fork' : ''} ${index + 1}... `,
      transaction.description,
      rpcUrl,
    )

    const transactionUtils = new TransactionUtils({
      rpcUrl: rpcUrl,
      walletPrivateKey: privateKey,
      chainInfo: params.chainInfo,
      useFork: useFork ? true : false,
    })

    if (params.simulateOnly) {
      try {
        const res = await transactionUtils.sendSimulation({
          transaction: transaction.transaction,
        })
        console.log('Simulated transaction ' + res.data)
        statuses.push('success')
      } catch (error) {
        console.error('Error simulating transaction:', error)
        statuses.push('failed')
      }
    } else {
      const receipt = await transactionUtils.sendTransactionWithReceipt({
        transaction: transaction.transaction,
      })
      console.log('Transaction ' + receipt.status, receipt.transactionHash)
      statuses.push(receipt.status)
    }
  }

  console.log('Statuses ready', statuses)
  return { statuses }
}
