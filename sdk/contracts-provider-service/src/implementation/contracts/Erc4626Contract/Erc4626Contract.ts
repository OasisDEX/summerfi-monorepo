import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IErc20Contract, IErc4626Contract } from '@summerfi/contracts-provider-common'
import {
  Address,
  IAddress,
  IChainInfo,
  IToken,
  ITokenAmount,
  LoggingService,
  Maybe,
  TokenAmount,
  TransactionInfo,
} from '@summerfi/sdk-common'
import assert from 'assert'
import { erc4626Abi } from 'viem'
import { ContractWrapper } from '../ContractWrapper'
import { Erc20Contract } from '../Erc20Contract/Erc20Contract'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name Erc4626Contract
 * @description Implementation for the ERC4626 contract wrapper
 * @implements IErc4626Contract
 */
export class Erc4626Contract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof erc4626Abi, TClient, TAddress>
  implements IErc4626Contract
{
  private readonly _erc20Contract: IErc20Contract
  private _asset: Maybe<IToken>
  private _share: Maybe<IToken>
  private _tokensManager: ITokensManager

  /** FACTORY METHOD */

  /**
   * Creates a new instance of the Erc4626Contract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IErc4626Contract> {
    const erc20Contract = await Erc20Contract.create(params)

    const instance = new Erc4626Contract({
      blockchainClient: params.blockchainClient,
      tokensManager: params.tokensManager,
      chainInfo: params.chainInfo,
      address: params.address,
      erc20Contract,
    })

    await instance._initializeAssetAndShare()

    return instance
  }

  /** SEALED CONSTRUCTOR */

  /**
   * @param blockchainClient The blockchain client to be used for interacting with the contract
   * @param chainInfo The chain information for the chain where the contract is deployed
   * @param address The address of the contract
   */
  private constructor(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
    chainInfo: IChainInfo
    address: TAddress
    erc20Contract: IErc20Contract
  }) {
    super(params)

    this._erc20Contract = params.erc20Contract
    this._tokensManager = params.tokensManager
  }

  /** PUBLIC */

  /** READ METHODS */

  /** @see IErc4626Contract.asset */
  async asset(): Promise<IToken> {
    assert(this._asset, 'Underlying asset is not initialized, this should never happen')

    return this._asset
  }

  /** @see IErc4626Contract.totalAssets */
  async totalAssets(): Promise<ITokenAmount> {
    const [totalAssets, token] = await Promise.all([this.contract.read.totalAssets(), this.asset()])

    return TokenAmount.createFromBaseUnit({
      token,
      amount: totalAssets.toString(),
    })
  }

  /** @see IErc4626Contract.convertToAssets */
  async convertToAssets(params: { amount: ITokenAmount }): Promise<ITokenAmount> {
    const [token, assetsAmount] = await Promise.all([
      this.asset(),
      this.contract.read.convertToAssets([params.amount.toSolidityValue()]),
    ])

    // LoggingService.debug(
    //   'convertToAssets',
    //   params.amount.toSolidityValue(),
    //   '=>',
    //   assetsAmount.toString(),
    // )

    return TokenAmount.createFromBaseUnit({
      token,
      amount: String(assetsAmount),
    })
  }

  /** @see IErc4626Contract.convertToShares */
  async convertToShares(params: { amount: ITokenAmount }): Promise<ITokenAmount> {
    const [token, sharesAmount] = await Promise.all([
      this.asErc20().getToken(),
      this.contract.read.convertToShares([params.amount.toSolidityValue()]),
    ])

    // LoggingService.debug(
    //   'convertToShares',
    //   params.amount.toSolidityValue(),
    //   '=>',
    //   sharesAmount.toString(),
    // )

    return TokenAmount.createFromBaseUnit({
      token,
      amount: String(sharesAmount),
    })
  }

  /** @see IErc4626Contract.previewDeposit */
  async previewDeposit(
    params: Parameters<IErc4626Contract['previewDeposit']>[0],
  ): Promise<ITokenAmount> {
    const [token, sharesAmount] = await Promise.all([
      this.asErc20().getToken(),
      this.contract.read.previewDeposit([params.assets.toSolidityValue()]),
    ])

    LoggingService.debug(
      'previewDeposit',
      params.assets.toString(),
      '=> shares ',
      sharesAmount.toString(),
    )

    return TokenAmount.createFromBaseUnit({
      token,
      amount: sharesAmount.toString(),
    })
  }

  /** @see IErc4626Contract.previewWithdraw */
  async previewWithdraw(
    params: Parameters<IErc4626Contract['previewWithdraw']>[0],
  ): ReturnType<IErc4626Contract['previewWithdraw']> {
    const [token, sharesAmount] = await Promise.all([
      this.asErc20().getToken(),
      this.contract.read.previewWithdraw([params.assets.toSolidityValue()]),
    ])

    LoggingService.debug(
      'previewWithdraw',
      params.assets.toString(),
      '=> shares ',
      sharesAmount.toString(),
    )

    return TokenAmount.createFromBaseUnit({
      token,
      amount: sharesAmount.toString(),
    })
  }

  /** @see IErc4626Contract.previewRedeem*/
  async previewRedeem(
    params: Parameters<IErc4626Contract['previewRedeem']>[0],
  ): ReturnType<IErc4626Contract['previewRedeem']> {
    const [token, assetsAmount] = await Promise.all([
      this.asErc20().getToken(),
      this.contract.read.previewRedeem([params.shares.toSolidityValue()]),
    ])

    LoggingService.debug(
      'previewRedeem',
      params.shares.toString(),
      '=> assets ',
      assetsAmount.toString(),
    )

    return TokenAmount.createFromBaseUnit({
      token,
      amount: assetsAmount.toString(),
    })
  }

  /** WRITE METHODS */

  /** @see IErc4626Contract.deposit */
  async deposit(params: { assets: ITokenAmount; receiver: IAddress }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'deposit',
      args: [params.assets.toSolidityValue(), params.receiver.value],
      description: `Deposit ${params.assets} on behalf of ${params.receiver} to vault ${this.address}`,
    })
  }

  /** @see IErc4626Contract.withdraw */
  async withdraw(params: {
    assets: ITokenAmount
    receiver: IAddress
    owner: IAddress
  }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'withdraw',
      args: [params.assets.toSolidityValue(), params.receiver.value, params.owner.value],
      description: `Withdraw ${params.assets} from vault ${this.address} to address ${params.receiver} on behalf of ${params.owner}`,
    })
  }

  /** CONVERSION METHODS */

  /** @see IErc4626Contract.asErc20 */
  asErc20(): IErc20Contract {
    return this._erc20Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof erc4626Abi {
    return erc4626Abi
  }

  /** PRIVATE */

  /**
   * Initializes the underlying asset of the contract to be used when returning the total assets of the vault
   */
  private async _initializeAssetAndShare(): Promise<void> {
    const assetAddress = await this.contract.read.asset()

    const assetErc20Contract = await Erc20Contract.create({
      blockchainClient: this.blockchainClient,
      tokensManager: this._tokensManager,
      chainInfo: this.chainInfo,
      address: Address.createFromEthereum({
        value: assetAddress,
      }),
    })

    this._asset = await assetErc20Contract.getToken()
  }
}
