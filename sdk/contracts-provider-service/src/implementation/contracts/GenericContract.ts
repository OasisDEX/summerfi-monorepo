import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IErc20Contract, IErc4626Contract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from './ContractWrapper'

import { Erc4626Contract } from './Erc4626Contract/Erc4626Contract'
import type { ContractAbi } from '@summerfi/abi-provider-common'

/**
 * @name GenericContractWrapper
 * @description Implementation for the generic contract
 */
export class GenericContractWrapper<
  const TClient extends IBlockchainClient,
  TAddress extends IAddress,
  TAbi extends ContractAbi,
> extends ContractWrapper<TAbi, TClient, TAddress> {
  readonly _erc4626Contract: IErc4626Contract
  readonly _abi: TAbi

  /** FACTORY METHOD */
  /**
   * Creates a new instance of the Erc4626Contract
   *
   * @see constructor
   */
  static async create<
    TClient extends IBlockchainClient,
    TAddress extends IAddress,
    TAbi extends ContractAbi,
  >(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
    abi: TAbi
  }): Promise<GenericContractWrapper<TClient, TAddress, TAbi>> {
    const erc4626Contract = await Erc4626Contract.create(params)

    const instance = new GenericContractWrapper({
      blockchainClient: params.blockchainClient,
      chainInfo: params.chainInfo,
      address: params.address,
      erc4626Contract,
      abi: params.abi,
    })

    return instance
  }

  /** CONSTRUCTOR */
  constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
    erc4626Contract: IErc4626Contract
    abi: TAbi
  }) {
    super(params)

    this._erc4626Contract = params.erc4626Contract
    this._abi = params.abi
  }

  /** CASTING METHODS */
  asErc20(): IErc20Contract {
    return this.asErc4626().asErc20()
  }

  asErc4626(): IErc4626Contract {
    return this._erc4626Contract
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): TAbi {
    return this._abi
  }

  /** PRIVATE */
}
