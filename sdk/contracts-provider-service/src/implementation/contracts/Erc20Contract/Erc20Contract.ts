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
import type { ITokensManager } from '@summerfi/tokens-common'

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
  private _tokensManager: ITokensManager

  /** FACTORY METHOD */

  /**
   * Creates a new instance of the Erc4626Contract
   *
   * @see constructor
   */
  static create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
    chainInfo: IChainInfo
    address: TAddress
  }): IErc20Contract {
    return new Erc20Contract(params)
  }

  /** SEALED CONSTRUCTOR */
  private constructor(params: {
    blockchainClient: TClient
    tokensManager: ITokensManager
    chainInfo: IChainInfo
    address: TAddress
  }) {
    super(params)
    this._tokensManager = params.tokensManager
  }

  /** PUBLIC */

  /** READ METHODS */

  /** @see IErc20Contract.getToken */
  async getToken(): Promise<IToken> {
    if (!this._token) {
      let maybeToken: IToken | undefined
      try {
        maybeToken = this._tokensManager.getTokenByAddress({
          chainInfo: this.chainInfo,
          address: this.address,
        })
      } catch {
        // token not found which is ok as it is only fallback for internal symbols
      }

      const tokenInfo = await this._retrieveTokenInfo()

      return Token.createFrom({
        address: this.address,
        chainInfo: this.chainInfo,
        decimals: tokenInfo.decimals,
        symbol: maybeToken !== undefined ? maybeToken.symbol : tokenInfo.symbol,
        name: tokenInfo.name,
      })
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
      description: `Approve ${params.spender} to spend ${params.amount} at ${this.address}`,
    })
  }

  private async _retrieveTokenInfo(): Promise<{ decimals: number; symbol: string; name: string }> {
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
      throw new Error(`Error retrieving token info: ${address}`)
    }
    const [{ result: decimals }, { result: symbol }, { result: name }] = results
    if (!decimals || !symbol || !name) {
      throw new Error(`Contract reading succeeded but some values are undefined: ${address}`)
    }
    return {
      decimals: Number(decimals),
      symbol,
      name,
    }
  }
}
