import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import {
  IErc20Contract,
  IErc4626Contract,
  type IFleetCommanderWhitelistContract,
} from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, TransactionInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { FleetCommanderWhitelistAbi } from '@summerfi/armada-protocol-abis'
import { Erc4626Contract } from '../Erc4626Contract/Erc4626Contract'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name FleetCommanderWhitelistContract
 * @description Implementation for the FleetCommanderWhitelist contract wrapper
 * @implements IFleetCommanderWhitelistContract
 */
export class FleetCommanderWhitelistContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof FleetCommanderWhitelistAbi, TClient, TAddress>
  implements IFleetCommanderWhitelistContract
{
  readonly _erc4626Contract: IErc4626Contract

  /** STATIC CONSTRUCTOR */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IFleetCommanderWhitelistContract> {
    const erc4626Contract = await Erc4626Contract.create(params)

    const instance = new FleetCommanderWhitelistContract({
      blockchainClient: params.blockchainClient,
      chainInfo: params.chainInfo,
      address: params.address,
      erc4626Contract,
    })

    return instance
  }

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
    erc4626Contract: IErc4626Contract
  }) {
    super(params)

    this._erc4626Contract = params.erc4626Contract
  }

  /** WRITE METHODS */

  /** @see IFleetCommanderContract.setWhitelisted */
  setWhitelisted(params: { account: IAddress; allowed: boolean }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'setWhitelisted',
      args: [params.account.toSolidityValue(), params.allowed],
      description: `Set whitelist status for ${params.account} to ${params.allowed}`,
    })
  }

  /** @see IFleetCommanderContract.setWhitelistedBatch */
  setWhitelistedBatch(params: {
    accounts: IAddress[]
    allowed: boolean[]
  }): Promise<TransactionInfo> {
    const accountsSolidity = params.accounts.map((account) => account.toSolidityValue())
    return this._createTransaction({
      functionName: 'setWhitelistedBatch',
      args: [accountsSolidity, params.allowed],
      description: `Batch set whitelist status for ${params.accounts.length} accounts`,
    })
  }

  /** READ METHODS */

  /** @see IFleetCommanderContract.isWhitelisted */
  async isWhitelisted(params: { account: IAddress }): Promise<boolean> {
    return this.contract.read.isWhitelisted([params.account.value])
  }

  /** CASTING METHODS */

  /** @see IFleetCommanderContract.asErc20 */
  asErc20(): IErc20Contract {
    return this.asErc4626().asErc20()
  }

  /** @see IFleetCommanderContract.asErc4626 */
  asErc4626(): IErc4626Contract {
    return this._erc4626Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof FleetCommanderWhitelistAbi {
    return FleetCommanderWhitelistAbi
  }
}
