import { Transaction } from '@summerfi/sdk-common/orders'
import {
  Account,
  WalletClient,
  Hex,
  createWalletClient,
  http,
  Transport,
  Hash,
  createPublicClient,
  PublicClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export class TransactionUtils {
  private readonly account: Account
  private readonly walletClient: WalletClient
  private readonly publicClient: PublicClient
  private readonly transport: Transport

  constructor(params: { rpcUrl: string; walletPrivateKey: Hex }) {
    this.account = privateKeyToAccount(params.walletPrivateKey)
    this.transport = http(params.rpcUrl)

    this.walletClient = createWalletClient({
      transport: this.transport,
    })

    this.publicClient = createPublicClient({
      chain: mainnet,
      transport: this.transport,
    })
  }

  async sendTransaction(params: {
    transaction: Transaction
    waitForConfirmation?: boolean
  }): Promise<Hash> {
    const transactionHash = await this.walletClient.sendTransaction({
      account: this.account,
      to: params.transaction.target.value,
      value: BigInt(params.transaction.value),
      chain: mainnet,
      data: params.transaction.calldata,
      gas: 1000000000n,
    })

    if (params.waitForConfirmation) {
      await this.publicClient.waitForTransactionReceipt({
        hash: transactionHash,
        confirmations: 1,
      })
    }

    return transactionHash
  }
}
