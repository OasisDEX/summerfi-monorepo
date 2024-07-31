import { IChainInfo, type TransactionInfo } from '@summerfi/sdk-common'
import { isHex } from 'viem/utils'
import { TransactionUtils } from './TransactionUtils'

export async function sendAndLogTransactions(params: {
  chainInfo: IChainInfo
  transactions: TransactionInfo[]
}) {
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error('DEPLOYER_PRIVATE_KEY not set')
  }
  if (!process.env.E2E_SDK_FORK_URL) {
    throw new Error('E2E_SDK_FORK_URL not set')
  }
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY
  const forkUrl = process.env.E2E_SDK_FORK_URL

  console.log('transactions', params.transactions)

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

    const receipt = await transactionUtils.sendTransaction({
      transaction: transaction.transaction,
      waitForConfirmation: true,
    })

    console.log('Transaction sent:', receipt)
  }
}
