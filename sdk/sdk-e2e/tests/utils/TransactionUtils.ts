import { AddressValue } from '@summerfi/sdk-common/common'
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
      data: params.transaction.calldata,
      gas: 1000000000n,
    })
  }

  /**
   * Sends a transaction from an impersonated account.
   *
   * @param params - The parameters for the transaction.
   * @param params.transaction - The transaction to send.
   * @param params.transaction.target - The target address of the transaction.
   * @param params.transaction.calldata - The calldata of the transaction.
   * @param params.impersonate - The address of the account to impersonate.
   *
   * @returns A promise that resolves when the transaction has been sent.
   *
   * @throws Will throw an error if the transaction fails.
   */
  async impersonateSendTransaction(params: {
    transaction: Transaction
    impersonate: AddressValue
  }) {
    return this.walletClient.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: params.impersonate,
          to: params.transaction.target.value,
          data: params.transaction.calldata,
          gas: `0x4C4B40` as Hex,
        },
      ],
    })
  }
}
