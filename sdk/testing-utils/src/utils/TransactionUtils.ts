import { IChainInfo, Maybe, Transaction } from '@summerfi/sdk-common'
import { getRpcGatewayEndpoint } from '@summerfi/serverless-shared'
import {
  Account,
  Chain,
  Hash,
  Hex,
  PublicClient,
  TestClient,
  TransactionReceipt,
  Transport,
  WalletClient,
  createPublicClient,
  createTestClient,
  createWalletClient,
  defineChain,
  http,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export class TransactionUtils {
  public readonly account: Maybe<Account> = undefined
  public readonly walletClient: WalletClient
  public readonly publicClient: PublicClient
  public readonly testClient: TestClient
  public readonly transport: Transport
  public readonly chainInfo: IChainInfo
  public readonly chain: Chain

  constructor(params: {
    rpcUrl: string
    chainInfo: IChainInfo
    walletPrivateKey?: Hex
    useFork?: boolean
  }) {
    this.chainInfo = params.chainInfo
    if (params.walletPrivateKey) {
      this.account = privateKeyToAccount(params.walletPrivateKey)
    }

    const gatewayUrl =
      params.chainInfo &&
      getRpcGatewayEndpoint(params.rpcUrl, params.chainInfo.chainId, {
        skipCache: false,
        skipMulticall: false,
        skipGraph: true,
        stage: 'stg',
        source: 'e2e',
      })
    this.transport = params.useFork
      ? http(params.rpcUrl)
      : http(gatewayUrl, {
          batch: true,
          fetchOptions: {
            method: 'POST',
          },
        })

    this.chain = defineChain({
      id: this.chainInfo.chainId,
      name: this.chainInfo.name,
      nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
      },
      rpcUrls: {
        default: {
          http: [params.rpcUrl],
        },
      },
      blockExplorers: {
        default: { name: 'Explorer', url: '' },
      },
    })

    this.walletClient = createWalletClient({
      transport: this.transport,
      chain: this.chain,
    })

    this.publicClient = createPublicClient({
      transport: this.transport,
      chain: this.chain,
    })

    this.testClient = createTestClient({
      mode: 'anvil',
      chain: this.chain,
      transport: this.transport,
    })
  }

  async sendTransaction(params: {
    transaction: Transaction
    waitForConfirmation?: boolean
  }): Promise<Hash> {
    const transactionHash = await this._sendTransaction(params)

    if (params.waitForConfirmation) {
      await this._waitForReceipt({ hash: transactionHash })
    }

    return transactionHash
  }

  async sendTransactionWithReceipt(params: {
    transaction: Transaction
  }): Promise<TransactionReceipt> {
    const transactionHash = await this._sendTransaction(params)

    return this._waitForReceipt({ hash: transactionHash })
  }

  private async _sendTransaction(params: {
    walletPrivateKey?: Hex
    transaction: Transaction
  }): Promise<Hash> {
    const account = params.walletPrivateKey
      ? privateKeyToAccount(params.walletPrivateKey)
      : this.account

    if (!account) {
      throw new Error(
        'No account provided at fork construction and no private key provided to send transaction',
      )
    }

    return await this.walletClient.sendTransaction({
      account: account,
      to: params.transaction.target.value,
      value: BigInt(params.transaction.value),
      data: params.transaction.calldata,
      chain: this.chain,
    })
  }

  private async _waitForReceipt(params: {
    hash: Hash
    confirmations?: number
  }): Promise<TransactionReceipt> {
    return await this.publicClient.waitForTransactionReceipt({
      hash: params.hash,
      confirmations: params.confirmations || 1,
    })
  }
}
