import { IChainInfo, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export async function sendAndLogTransactions(params: {
  chainInfo: IChainInfo
  transactions: TransactionInfo[]
  rpcUrl: string
  privateKey: string
  useRpcGateway?: boolean
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

  // console.log('transactions', params.transactions)

  const statuses: string[] = []

  for (const [index, transaction] of params.transactions.entries()) {
    console.log(`Sending transaction ${index}...`, transaction.description)

    const transactionUtils = new TransactionUtils({
      rpcUrl: rpcUrl,
      walletPrivateKey: privateKey,
      chainInfo: params.chainInfo,
      useRpcGateway: params.useRpcGateway ? true : false,
    })

    const receipt = await transactionUtils.sendTransactionWithReceipt({
      transaction: transaction.transaction,
    })
    console.log('Transaction ' + receipt.status, receipt.transactionHash)
    statuses.push(receipt.status)
  }

  return { statuses }
}
