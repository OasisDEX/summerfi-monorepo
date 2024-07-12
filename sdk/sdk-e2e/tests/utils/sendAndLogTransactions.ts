import { base } from 'viem/chains'
import { isHex } from 'viem/utils'
import { type TransactionInfo } from '@summerfi/sdk-common'
import { TransactionUtils } from './TransactionUtils'

if (!process.env.DEPLOYER_PRIVATE_KEY) {
  throw new Error('DEPLOYER_PRIVATE_KEY not set')
}
if (!process.env.E2E_SDK_FORK_URL) {
  throw new Error('E2E_SDK_FORK_URL not set')
}

const privateKey = process.env.DEPLOYER_PRIVATE_KEY
const forkUrl = process.env.E2E_SDK_FORK_URL

export async function sendAndLogTransactions(transactions: TransactionInfo[]) {
  console.log('transactions', transactions)

  for (const [index, transaction] of transactions.entries()) {
    console.log(`Sending transaction ${index}...`, transaction.description)

    if (!isHex(privateKey)) {
      throw new Error('Invalid DEPLOYER_PRIVATE_KEY')
    }
    const transactionUtils = new TransactionUtils({
      rpcUrl: forkUrl,
      walletPrivateKey: privateKey,
      chain: base,
    })

    const receipt = await transactionUtils.sendTransaction({
      transaction: transaction.transaction,
      waitForConfirmation: true,
    })

    console.log('Transaction sent:', receipt)
  }
}
