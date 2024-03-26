import { Transaction } from '@summerfi/sdk-common/orders'
import { Account, WalletClient, Hex, createWalletClient, http, Transport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'

export class TransactionUtils {
  private readonly account: Account
  private readonly walletClient: WalletClient
  private readonly transport: Transport

  constructor(params: { rpcUrl: string; walletPrivateKey: Hex }) {
    this.account = privateKeyToAccount(params.walletPrivateKey)
    this.transport = http(params.rpcUrl)

    this.walletClient = createWalletClient({
      transport: this.transport,
    })
  }

  async sendTransaction(params: { transaction: Transaction }) {
    return this.walletClient.sendTransaction({
      account: this.account,
      to: params.transaction.target.value,
      value: BigInt(params.transaction.value),
      chain: mainnet,
    })
  }
}
