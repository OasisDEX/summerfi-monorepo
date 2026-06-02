import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IRoundsVaultContract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { RoundsVaultAbi } from '@summerfi/armada-protocol-abis'

/**
 * @name RoundsVaultContract
 * @description Implementation for the RoundsVault contract wrapper (Input and Output vaults share the
 *              same ABI)
 * @implements IRoundsVaultContract
 */
export class RoundsVaultContract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof RoundsVaultAbi, TClient, TAddress>
  implements IRoundsVaultContract
{
  /** FACTORY METHOD */

  /**
   * Creates a new instance of the RoundsVaultContract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<RoundsVaultContract<TClient, TAddress>> {
    return new RoundsVaultContract(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }) {
    super(params)
  }

  /** METHODS */

  /** @see IContractWrapper.getAbi */
  getAbi() {
    return RoundsVaultAbi
  }

  /** READ METHODS */

  /** @see IRoundsVaultContract.getCurrentRound */
  async getCurrentRound(): ReturnType<IRoundsVaultContract['getCurrentRound']> {
    return this.contract.read.getCurrentRound()
  }

  /** @see IRoundsVaultContract.roundState */
  async roundState(
    params: Parameters<IRoundsVaultContract['roundState']>[0],
  ): ReturnType<IRoundsVaultContract['roundState']> {
    return this.contract.read.roundState([params.roundId])
  }

  /** @see IRoundsVaultContract.getExchangeRate */
  async getExchangeRate(
    params: Parameters<IRoundsVaultContract['getExchangeRate']>[0],
  ): ReturnType<IRoundsVaultContract['getExchangeRate']> {
    const price = await this.contract.read.getExchangeRate([params.round])
    return { baseAmount: price.baseAmount, quoteAmount: price.quoteAmount }
  }

  /** WRITE METHODS */

  /** @see IRoundsVaultContract.deposit */
  async deposit(
    params: Parameters<IRoundsVaultContract['deposit']>[0],
  ): ReturnType<IRoundsVaultContract['deposit']> {
    return this._createTransaction({
      functionName: 'deposit',
      args: [params.assets, params.receiver],
      description: `Deposit ${params.assets} into RoundsVault ${this.address.value} for ${params.receiver}`,
    })
  }

  /** @see IRoundsVaultContract.redeem */
  async redeem(
    params: Parameters<IRoundsVaultContract['redeem']>[0],
  ): ReturnType<IRoundsVaultContract['redeem']> {
    return this._createTransaction({
      functionName: 'redeem',
      args: [params.id, params.amount, params.receiver, params.owner],
      description: `Redeem ${params.amount} of round ${params.id} receipt from RoundsVault ${this.address.value}`,
    })
  }

  /** @see IRoundsVaultContract.redeemExchangeAsset */
  async redeemExchangeAsset(
    params: Parameters<IRoundsVaultContract['redeemExchangeAsset']>[0],
  ): ReturnType<IRoundsVaultContract['redeemExchangeAsset']> {
    return this._createTransaction({
      functionName: 'redeemExchangeAsset',
      args: [params.id, params.amount, params.receiver, params.owner],
      description: `Redeem exchange asset for ${params.amount} of round ${params.id} receipt from RoundsVault ${this.address.value}`,
    })
  }

  /** @see IRoundsVaultContract.setMinPositionSize */
  async setMinPositionSize(
    params: Parameters<IRoundsVaultContract['setMinPositionSize']>[0],
  ): ReturnType<IRoundsVaultContract['setMinPositionSize']> {
    return this._createTransaction({
      functionName: 'setMinPositionSize',
      args: [params.minSize],
      description: `Set minimum position size to ${params.minSize} for RoundsVault ${this.address.value}`,
    })
  }
}
