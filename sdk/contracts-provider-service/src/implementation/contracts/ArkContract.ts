import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { type IArkContract } from '@summerfi/contracts-provider-common'
import { Address, IAddress, IChainInfo, Percentage, type IArkConfig } from '@summerfi/sdk-common'
import { ContractWrapper } from './ContractWrapper'

import { ArkAbi } from '@summerfi/armada-protocol-abis'
import type { ITokensManager } from '@summerfi/tokens-common'

/**
 * @name ArkContract
 * @description Implementation for the Ark contract wrapper
 * @implements IArkContract
 */
export class ArkContract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof ArkAbi, TClient, TAddress>
  implements IArkContract
{
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
  }): Promise<IArkContract> {
    const instance = new ArkContract({
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

  /** @see IFleetCommanderContract.arkConfig */
  async config(): Promise<IArkConfig> {
    const [
      commander,
      raft,
      asset,
      depositCap,
      maxRebalanceOutflow,
      maxRebalanceInflow,
      name,
      details,
      requiresKeeperData,
      maxDepositPercentageOfTVL,
    ] = await this.contract.read.config()

    return {
      commander: Address.createFromEthereum({ value: commander }),
      raft: Address.createFromEthereum({ value: raft }),
      asset: Address.createFromEthereum({ value: asset }),
      depositCap: depositCap.toString(),
      maxRebalanceOutflow: maxRebalanceOutflow.toString(),
      maxRebalanceInflow: maxRebalanceInflow.toString(),
      name,
      details,
      requiresKeeperData,
      maxDepositPercentageOfTVL: Percentage.createFromSolidityValue({
        value: maxDepositPercentageOfTVL,
      }),
    }
  }

  /** CASTING METHODS */

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof ArkAbi {
    return ArkAbi
  }
}
