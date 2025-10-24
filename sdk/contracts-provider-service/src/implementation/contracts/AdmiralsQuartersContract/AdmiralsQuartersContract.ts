import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IAdmiralsQuartersContract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, TransactionInfo, type AddressValue } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'
import { AdmiralsQuartersWhitelistAbi } from '@summerfi/armada-protocol-abis'

/**
 * @name AdmiralsQuartersContract
 * @description Implementation for the AdmiralsQuarters contract wrapper
 * @implements IAdmiralsQuartersContract
 */
export class AdmiralsQuartersContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof AdmiralsQuartersWhitelistAbi, TClient, TAddress>
  implements IAdmiralsQuartersContract
{
  /** STATIC CONSTRUCTOR */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IAdmiralsQuartersContract> {
    const instance = new AdmiralsQuartersContract({
      blockchainClient: params.blockchainClient,
      chainInfo: params.chainInfo,
      address: params.address,
    })

    return instance
  }

  /** CONSTRUCTOR */
  constructor(params: { blockchainClient: TClient; chainInfo: IChainInfo; address: TAddress }) {
    super(params)
  }

  /** READ METHODS */

  /** @see IAdmiralsQuartersContract.isWhitelisted */
  async isWhitelisted(params: { account: AddressValue }): Promise<boolean> {
    return this._contract.read.isWhitelisted([params.account])
  }

  /** WRITE METHODS */

  /** @see IAdmiralsQuartersContract.setWhitelisted */
  async setWhitelisted(params: {
    account: AddressValue
    allowed: boolean
  }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setWhitelisted',
      args: [params.account, params.allowed],
      description: `Set whitelist status for ${params.account} to ${params.allowed}`,
    })
  }

  /** @see IAdmiralsQuartersContract.setWhitelistedBatch */
  async setWhitelistedBatch(params: {
    accounts: AddressValue[]
    allowed: boolean[]
  }): Promise<TransactionInfo> {
    if (params.accounts.length !== params.allowed.length) {
      throw new Error('Accounts and allowed arrays must have the same length')
    }

    return this._createTransaction({
      functionName: 'setWhitelistedBatch',
      args: [params.accounts, params.allowed],
      description: `Set whitelist status for ${params.accounts.length} accounts`,
    })
  }

  /** PUBLIC METHODS */

  /** @see ContractWrapper.getAbi */
  getAbi() {
    return AdmiralsQuartersWhitelistAbi
  }
}
