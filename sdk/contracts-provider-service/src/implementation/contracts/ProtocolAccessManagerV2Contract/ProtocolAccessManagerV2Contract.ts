import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IProtocolAccessManagerV2Contract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { ProtocolAccessManagerV2Abi } from '@summerfi/armada-protocol-abis'

/**
 * @name ProtocolAccessManagerV2Contract
 * @description Implementation for the ProtocolAccessManagerV2 contract wrapper (per-context whitelist)
 * @implements IProtocolAccessManagerV2Contract
 */
export class ProtocolAccessManagerV2Contract<
  const TClient extends IBlockchainClient,
  TAddress extends IAddress,
>
  extends ContractWrapper<typeof ProtocolAccessManagerV2Abi, TClient, TAddress>
  implements IProtocolAccessManagerV2Contract
{
  /** FACTORY METHOD */

  /**
   * Creates a new instance of the ProtocolAccessManagerV2Contract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<ProtocolAccessManagerV2Contract<TClient, TAddress>> {
    return new ProtocolAccessManagerV2Contract(params)
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
    return ProtocolAccessManagerV2Abi
  }

  /** READ METHODS */

  /** @see IProtocolAccessManagerV2Contract.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IProtocolAccessManagerV2Contract['isWhitelisted']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['isWhitelisted']> {
    return this.contract.read.isWhitelisted([params.context.value, params.account.value])
  }

  /** @see IProtocolAccessManagerV2Contract.isWhitelistOpen */
  async isWhitelistOpen(
    params: Parameters<IProtocolAccessManagerV2Contract['isWhitelistOpen']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['isWhitelistOpen']> {
    return this.contract.read.isWhitelistOpen([params.context.value])
  }

  /** WRITE METHODS */

  /** @see IProtocolAccessManagerV2Contract.setWhitelisted */
  async setWhitelisted(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelisted']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelisted']> {
    return this._createTransaction({
      functionName: 'setWhitelisted',
      args: [params.context.value, params.account.value, params.allowed],
      description: `Set whitelist status of ${params.account.value} to ${params.allowed} for context ${params.context.value}`,
    })
  }

  /** @see IProtocolAccessManagerV2Contract.setWhitelistedBatch */
  async setWhitelistedBatch(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelistedBatch']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelistedBatch']> {
    return this._createTransaction({
      functionName: 'setWhitelistedBatch',
      args: [params.context.value, params.accounts.map((a) => a.value), params.allowed],
      description: `Set whitelist status for ${params.accounts.length} accounts for context ${params.context.value}`,
    })
  }

  /** @see IProtocolAccessManagerV2Contract.setWhitelistOpen */
  async setWhitelistOpen(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelistOpen']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelistOpen']> {
    return this._createTransaction({
      functionName: 'setWhitelistOpen',
      args: [params.context.value, params.isOpen],
      description: `Set whitelist open flag to ${params.isOpen} for context ${params.context.value}`,
    })
  }
}
