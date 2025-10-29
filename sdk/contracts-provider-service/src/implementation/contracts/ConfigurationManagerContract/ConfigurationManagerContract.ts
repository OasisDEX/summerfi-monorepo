import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IConfigurationManagerContract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, type AddressValue } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'
import { ConfigurationManagerAbi } from '@summerfi/armada-protocol-abis'

/**
 * @name ConfigurationManagerContract
 * @description Implementation for the ConfigurationManager contract wrapper
 * @implements IConfigurationManagerContract
 */
export class ConfigurationManagerContract<
    const TClient extends IBlockchainClient,
    TAddress extends IAddress,
  >
  extends ContractWrapper<typeof ConfigurationManagerAbi, TClient, TAddress>
  implements IConfigurationManagerContract
{
  /** STATIC CONSTRUCTOR */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IConfigurationManagerContract> {
    const instance = new ConfigurationManagerContract({
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

  /** @see IConfigurationManagerContract.treasury */
  async treasury(): Promise<AddressValue> {
    return this.contract.read.treasury()
  }

  /** PUBLIC METHODS */

  /** @see ContractWrapper.getAbi */
  getAbi() {
    return ConfigurationManagerAbi
  }
}
