import { base } from 'viem/chains'
import { isHex } from 'viem/utils'
import { type TransactionInfo } from '@summerfi/sdk-common'
import { TransactionUtils } from './TransactionUtils'

if (!process.env.DEPLOYER_PRIVATE_KEY) {
  throw new Error('DEPLOYER_PRIVATE_KEY not set')
}

const privateKey = process.env.DEPLOYER_PRIVATE_KEY
const forkUrl = 'https://virtual.base.rpc.tenderly.co/2916e1c7-7ddd-4cd2-b926-449ce4eb2f44'

export async function sendAndLogTransactions(transactions: TransactionInfo[]) {
  console.log('transactions', transactions)

  for (const [index, transaction] of transactions.entries()) {
    if (!isHex(privateKey)) {
      throw new Error('Invalid DEPLOYER_PRIVATE_KEY')
    }

    console.log(`Sending transaction ${index}...`, transaction.description)

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
