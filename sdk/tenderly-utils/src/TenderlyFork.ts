import { HexData, IAddress, IChainInfo, ITokenAmount, Transaction } from '@summerfi/sdk-common'
import { TransactionUtils } from '@summerfi/testing-utils'
import axios, { AxiosInstance } from 'axios'
import { JsonRpcProvider, ethers } from 'ethers'
import { TransactionReceipt } from 'viem'

/**
 * Implements the convenience methods to create and interact with a Tenderly Fork
 */
export class TenderlyFork {
  public readonly tenderlyApiUrl: string
  public readonly tenderlyAccessKey: string
  public readonly apiRequestClient: AxiosInstance
  public readonly forkId: string
  public readonly forkUrl: string
  public readonly chainInfo: IChainInfo
  public readonly atBlock: number | 'latest'
  public readonly transactionUtils: TransactionUtils
  private readonly rpcProvider: JsonRpcProvider

  /** SEALED CONSTRUCTOR */
  private constructor(params: {
    transactionUtils: TransactionUtils
    tenderlyApiUrl: string
    tenderlyAccessKey: string
    chainInfo: IChainInfo
    forkId: string
    forkUrl: string
    atBlock: number | 'latest'
  }) {
    this.transactionUtils = params.transactionUtils
    this.tenderlyApiUrl = params.tenderlyApiUrl
    this.tenderlyAccessKey = params.tenderlyAccessKey
    this.chainInfo = params.chainInfo
    this.forkId = params.forkId
    this.forkUrl = params.forkUrl
    this.atBlock = params.atBlock

    this.apiRequestClient = axios.create({
      baseURL: 'https://api.tenderly.co/api/v1',
      headers: {
        'X-Access-Key': this.tenderlyAccessKey,
        'Content-Type': 'application/json',
      },
    })

    this.transactionUtils = new TransactionUtils({
      rpcUrl: this.forkUrl,
      chainInfo: this.chainInfo,
    })

    this.rpcProvider = new JsonRpcProvider(this.forkUrl)
  }

  /** FACTORY */

  /**
   * @name create
   * @description Creates a new Tenderly fork with the given parameters
   */
  static async create(params: {
    tenderlyApiUrl: string
    tenderlyAccessKey: string
    chainInfo: IChainInfo
    atBlock: number | 'latest'
  }) {
    const apiRequestClient = axios.create({
      baseURL: 'https://api.tenderly.co/api/v1',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Access-Key': params.tenderlyAccessKey,
      },
    })

    const forkConfig = await this._createFork({
      apiRequestClient: apiRequestClient,
      tenderlyApiUrl: params.tenderlyApiUrl,
      tenderlyAccessKey: params.tenderlyAccessKey,
      chainInfo: params.chainInfo,
      atBlock: params.atBlock,
    })

    const transactionUtils = new TransactionUtils({
      chainInfo: params.chainInfo,
      rpcUrl: forkConfig.forkUrl,
    })

    return new TenderlyFork({
      transactionUtils: transactionUtils,
      chainInfo: params.chainInfo,
      forkId: forkConfig.forkId,
      forkUrl: forkConfig.forkUrl,
      tenderlyApiUrl: params.tenderlyApiUrl,
      tenderlyAccessKey: params.tenderlyAccessKey,
      atBlock: params.atBlock,
    })
  }

  /** PUBLIC METHODS */

  /**
   * @name dispose
   * @description Deletes the fork
   */
  public async dispose() {
    return this.apiRequestClient.delete(`${this.tenderlyApiUrl}/${this.forkId}`)
  }

  /**
   * Retrieves the list of simulations in the fork
   * @returns The list of simulations
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getSimulations(): Promise<any> {
    return this.apiRequestClient.get(
      `${this.tenderlyApiUrl}/${this.forkId}/transactions?page=1&perPage=20`,
    )
  }

  /**
   * @name getTransactionCount
   * @description Returns the number of transactions in the fork
   */
  public async getTransactionCount(): Promise<number> {
    const response = await this.getSimulations()
    return response.data.fork_transactions.length
  }

  /**
   * @name sendTransaction
   * @description Sends a transaction to the fork
   *
   * @param walletPrivateKey The private key of the wallet that will send the transaction
   * @param transaction The transaction to be sent
   * @param waitForConfirmation Whether to wait for the transaction to be confirmed
   */
  public async sendTransaction(params: {
    walletPrivateKey: HexData
    transaction: Transaction
  }): Promise<TransactionReceipt> {
    const transactionUtils = new TransactionUtils({
      chainInfo: this.chainInfo,
      rpcUrl: this.forkUrl,
      walletPrivateKey: params.walletPrivateKey,
    })

    return await transactionUtils.sendTransactionWithReceipt({
      transaction: params.transaction,
    })
  }

  /**
   * @name setErc20Balance
   * @description Sets the ERC20 balance of a wallet in the fork
   *
   * @param forkId The fork ID
   * @param balance The balance to set
   * @param walletAddress The address of the wallet
   */
  async setErc20Balance(params: { amount: ITokenAmount; walletAddress: IAddress }) {
    return this.rpcProvider.send('tenderly_setErc20Balance', [
      params.amount.token.address.value,
      params.walletAddress.value,
      ethers.toQuantity(params.amount.toSolidityValue()),
    ])
  }

  /**
   * @name setETHBalance
   * @description Sets the ETH balance of a wallet in the fork
   *
   * @param amount The amount to set as a bigint
   * @param walletAddress The address of the wallet
   */
  async setETHBalance(params: { amount: bigint; walletAddress: IAddress }) {
    return this.rpcProvider.send('tenderly_setBalance', [
      [params.walletAddress.value],
      ethers.toQuantity(params.amount),
    ])
  }

  /**
   * @name getETHBalance
   * @description Retrieves the ETH balance of a wallet in the fork
   *
   * @param walletAddress The address of the wallet
   *
   * @returns The ETH balance of the wallet as a big integer
   */
  async getETHBalance(params: { walletAddress: IAddress; atBlock?: number }): Promise<bigint> {
    return this.rpcProvider.send('eth_getBalance', [
      params.walletAddress.value,
      params.atBlock ? String(params.atBlock) : 'latest',
    ])
  }

  /** PRIVATE */

  /**
   * @name _initialize
   * @description Creates a new Tenderly fork and initializes the instance
   */
  private static async _createFork(params: {
    apiRequestClient: AxiosInstance
    tenderlyApiUrl: string
    tenderlyAccessKey: string
    chainInfo: IChainInfo
    atBlock: number | 'latest'
  }): Promise<{
    forkId: string
    forkUrl: string
  }> {
    let response

    try {
      response = await params.apiRequestClient.post(params.tenderlyApiUrl + '/vnets', {
        network_id: params.chainInfo.chainId,
        block_number: params.atBlock,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(`Error creating fork: ${JSON.stringify(error.response.data)}`)
    }

    const forkId = response.data.root_transaction.fork_id
    return {
      forkId: forkId,
      forkUrl: `https://rpc.tenderly.co/fork/${forkId}`,
    }
  }
}
