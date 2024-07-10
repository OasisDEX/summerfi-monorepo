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
  type Chain,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export class TransactionUtils {
  private readonly account: Account
  private readonly walletClient: WalletClient
  private readonly publicClient: PublicClient
  private readonly transport: Transport
  private readonly chain: Chain

  constructor(params: { rpcUrl: string; walletPrivateKey: Hex; chain?: Chain }) {
    this.account = privateKeyToAccount(params.walletPrivateKey)
    this.transport = http(params.rpcUrl)
    this.chain = params.chain || mainnet

    this.walletClient = createWalletClient({
      chain: this.chain,
      transport: this.transport,
    })

    this.publicClient = createPublicClient({
      chain: this.chain,
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
      data: params.transaction.calldata,
      gas: 1000000000n,
      chain: this.chain,
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
