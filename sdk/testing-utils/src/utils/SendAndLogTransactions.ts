import { IChainInfo, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export async function sendAndLogTransactions(params: {
  chainInfo: IChainInfo
  transactions: TransactionInfo[]
  forkUrl: string
  privateKey: string
}) {
  const privateKey = params.privateKey
  if (!privateKey) {
    throw new Error('Sender privateKey not set')
  }

  const forkUrl = params.forkUrl
  if (!forkUrl) {
    throw new Error('Sender forkUrl not set')
  }

  // console.log('transactions', params.transactions)

  const statuses: string[] = []

  for (const [index, transaction] of params.transactions.entries()) {
    console.log(`Sending transaction ${index}...`, transaction.description)

    if (!isHex(privateKey)) {
      throw new Error('Invalid DEPLOYER_PRIVATE_KEY')
    }
    const transactionUtils = new TransactionUtils({
      rpcUrl: forkUrl,
      walletPrivateKey: privateKey,
      chainInfo: params.chainInfo,
    })

    const receipt = await transactionUtils.sendTransactionWithReceipt({
      transaction: transaction.transaction,
    })
    console.log('Transaction ' + receipt.status, receipt.transactionHash)
    statuses.push(receipt.status)
  }

  return { statuses }
}
