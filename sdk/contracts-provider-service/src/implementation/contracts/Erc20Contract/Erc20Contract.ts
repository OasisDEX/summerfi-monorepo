import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IErc20Contract } from '@summerfi/contracts-provider-common'
import {
  IAddress,
  IChainInfo,
  IToken,
  ITokenAmount,
  Maybe,
  Token,
  TokenAmount,
  TransactionInfo,
} from '@summerfi/sdk-common'
import { erc20Abi } from 'viem'
import { ContractWrapper } from '../ContractWrapper'

/**
 * @name Erc20Contract
 * @description Implementation for the ERC20 contract wrapper
 * @implements IErc20Contract
 */
export class Erc20Contract<const TClient extends IBlockchainClient, TAddress extends IAddress>
  extends ContractWrapper<typeof erc20Abi, TClient, TAddress>
  implements IErc20Contract
{
  private _token: Maybe<IToken>

  /** FACTORY METHOD */

  /**
   * Creates a new instance of the Erc4626Contract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<IErc20Contract> {
    return new Erc20Contract(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }) {
    super(params)
  }

  /** PUBLIC */

  /** READ METHODS */

  /** @see IErc20Contract.getToken */
  async getToken(): Promise<IToken> {
    if (!this._token) {
      this._token = await this._retrieveTokenInfo()
    }
    return this._token
  }

  /** @see IErc20Contract.balanceOf */
  async balanceOf(params: { address: IAddress }): Promise<ITokenAmount> {
    const [balance, token] = await Promise.all([
      this.contract.read.balanceOf([params.address.value]),
      this.getToken(),
    ])

    return TokenAmount.createFromBaseUnit({
      token,
      amount: balance.toString(),
    })
  }

  async totalSupply(): Promise<ITokenAmount> {
    const [totalSupply, token] = await Promise.all([
      this.contract.read.totalSupply(),
      this.getToken(),
    ])

    return TokenAmount.createFromBaseUnit({
      token,
      amount: totalSupply.toString(),
    })
  }

  /** @see IErc20Contract.allowance */
  async allowance(params: { owner: IAddress; spender: IAddress }): Promise<ITokenAmount> {
    const [allowance, token] = await Promise.all([
      this.contract.read.allowance([params.owner.value, params.spender.value]),
      this.getToken(),
    ])

    return TokenAmount.createFromBaseUnit({
      token,
      amount: allowance.toString(),
    })
  }

  /** @see IContractWrapper.getAbi */
  getAbi(): typeof erc20Abi {
    return erc20Abi
  }

  /** WRITE METHODS */

  /** @see IErc20Contract.approve */
  async approve(params: { spender: IAddress; amount: ITokenAmount }): Promise<TransactionInfo> {
    return this._createTransaction({
      functionName: 'approve',
      args: [params.spender.value, params.amount.toSolidityValue()],
      description: `Approve ${params.spender} to spend ${params.amount} of ${this.address}`,
    })
  }

  /** PRIVATE */
  private async _retrieveTokenInfo(): Promise<IToken> {
    const abi = this.getAbi()
    const address = this.address.value

    const results = await this.blockchainClient.multicall({
      contracts: [
        {
          abi,
          address,
          functionName: 'decimals',
        },
        {
          abi,
          address,
          functionName: 'symbol',
        },
        {
          abi,
          address,
          functionName: 'name',
        },
      ],
    })

    const [{ status: statusDecimals }, { status: statusSymbol }, { status: statusName }] = results
    if (statusDecimals !== 'success' || statusSymbol !== 'success' || statusName !== 'success') {
      throw new Error('Error retrieving token info')
    }

    const [{ result: decimals }, { result: symbol }, { result: name }] = results
    if (!decimals || !symbol || !name) {
      throw new Error(
        'Contract reading succeeded but some values are undefined, this should not happen',
      )
    }

    return Token.createFrom({
      address: this.address,
      chainInfo: this.chainInfo,
      decimals,
      symbol,
      name,
    })
  }
}
