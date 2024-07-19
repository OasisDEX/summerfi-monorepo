import { ContractAbi } from '@summerfi/abi-provider-common'
import { IBlockchainClient } from '@summerfi/blockchain-client-provider'
import { IContractWrapper } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo } from '@summerfi/sdk-common'
import { GetContractReturnType, getContract } from 'viem'

/**
 * @name ContractWrapper
 * @description Base class for all contract wrappers
 */
export abstract class ContractWrapper<
  const TAbi extends ContractAbi,
  const TClient extends IBlockchainClient,
  TAddress extends IAddress,
> implements IContractWrapper
{
  private readonly _blockchainClient: TClient
  private readonly _chainInfo: IChainInfo
  private readonly _address: TAddress
  private readonly _contract: GetContractReturnType<TAbi, TClient, TAddress['value']>

  /** CONSTRUCTOR */
  protected constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }) {
    this._blockchainClient = params.blockchainClient
    this._chainInfo = params.chainInfo
    this._address = params.address
    this._contract = getContract({
      address: this._address.value,
      abi: this.getAbi(),
      client: this._blockchainClient,
    })
  }

  /** GETTERS */

  /** @see IErc20Contract.chainInfo */
  get chainInfo(): IChainInfo {
    return this._chainInfo
  }

  /** @see IErc20Contract.address */
  get address(): TAddress {
    return this._address
  }

  /** @see IErc20Contract.blockchainProvider */
  get blockchainClient(): TClient {
    return this._blockchainClient
  }

  get contract(): GetContractReturnType<TAbi, TClient, TAddress['value']> {
    return this._contract
  }

  /** VIRTUAL FUNCTIONS */

  /**
   * @name getAbi
   * @description Returns the abi of the contract
   * @returns {ContractAbi}
   *
   * @dev This function should be implemented by the child class
   */
  abstract getAbi(): TAbi
}
