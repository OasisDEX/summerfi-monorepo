import { IConfigurationProvider } from '@summerfi/configuration-provider-common'
import type { IBlockchainClientProvider } from '@summerfi/blockchain-client-common'
import {
  Address,
  ChainId,
  IChainInfo,
  IToken,
  Maybe,
  Token,
  TokenAmount,
  TokensProviderType,
  AddressType,
} from '@summerfi/sdk-common'
import { ManagerProviderBase } from '@summerfi/sdk-server-common'
import { ITokensProvider } from '@summerfi/tokens-common'
import assert from 'assert'
import { StaticTokensData } from './StaticTokensList'
import { TokenData } from './TokensData'
import { TokensMap } from './TokensMap'

/**
 * @name StaticTokensProvider
 * @description Implementation of the ITokensProvider interface for a static provider
 *
 * It contains a pre-built list of tokens per chain ID
 */
export class StaticTokensProvider
  extends ManagerProviderBase<TokensProviderType>
  implements ITokensProvider
{
  private _tokenByChainID: Map<ChainId, TokensMap>
  private readonly _blockchainClientProvider: IBlockchainClientProvider

  /** CONSTRUCTOR */

  /* eslint-disable @typescript-eslint/no-unused-vars */
  constructor(params: {
    configProvider: IConfigurationProvider
    blockchainClientProvider: IBlockchainClientProvider
  }) {
    super({
      type: TokensProviderType.Static,
      ...params,
    })

    this._blockchainClientProvider = params.blockchainClientProvider
    this._tokenByChainID = new Map()

    for (const tokenData of StaticTokensData.tokens) {
      this._addTokenData({ tokenData })
    }
  }

  /**
   * @method getSupportedChainIds
   * @description Retrieves the list of supported chain IDs
   * @returns The list of supported chain IDs
   */
  getSupportedChainIds: ITokensProvider['getSupportedChainIds'] = () => {
    return Array.from(this._tokenByChainID.keys())
  }

  /** @see ITokensProvider.getTokenBySymbol */
  getTokenBySymbol: ITokensProvider['getTokenBySymbol'] = (params) => {
    const { chainInfo } = params

    const tokenMap = this._getTokenMap(params.chainInfo)
    if (!tokenMap) {
      throw new Error(`No token map found for chain: ${chainInfo}`)
    }

    const tokenData = tokenMap.getBySymbol(params.symbol)
    if (!tokenData) {
      throw new Error(`No token data found for symbol: ${params.symbol} on chain: ${chainInfo}`)
    }

    return this._createToken({ chainInfo, tokenData })
  }

  /** @see ITokensProvider.getTokenByAddress */
  getTokenByAddress: ITokensProvider['getTokenByAddress'] = (params) => {
    const { chainInfo } = params

    const tokenMap = this._getTokenMap(params.chainInfo)
    if (!tokenMap) {
      throw new Error(`No token map found for chain: ${chainInfo}`)
    }

    const tokenData = tokenMap.getByAddress(params.address.value)
    if (!tokenData) {
      throw new Error(
        `No token data found for address: ${params.address.value} on chain: ${chainInfo}`,
      )
    }

    return this._createToken({ chainInfo, tokenData })
  }

  /** @see ITokensProvider.getTokenByName */
  getTokenByName: ITokensProvider['getTokenByName'] = (params) => {
    const { chainInfo } = params

    const tokenMap = this._getTokenMap(params.chainInfo)
    if (!tokenMap) {
      throw new Error(`No token map found for chain: ${chainInfo}`)
    }

    const tokenData = tokenMap.getByName(params.name)
    if (!tokenData) {
      throw new Error(`No token data found for name: ${params.name} on chain: ${chainInfo}`)
    }

    return this._createToken({ chainInfo, tokenData })
  }

  /** @see ITokensProvider.getTokenBalanceBySymbol */
  getTokenBalanceBySymbol: ITokensProvider['getTokenBalanceBySymbol'] = async (params) => {
    const token = this.getTokenBySymbol({ chainInfo: params.chainInfo, symbol: params.symbol })

    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })
    const balance = await client.getBalance({ address: token.address.value })

    return TokenAmount.createFromBaseUnit({
      token,
      amount: balance.toString(),
    })
  }

  /** @see ITokensProvider.getTokenBalanceByAddress */
  getTokenBalanceByAddress: ITokensProvider['getTokenBalanceByAddress'] = async (params) => {
    const token = this.getTokenByAddress({ chainInfo: params.chainInfo, address: params.address })

    const client = this._blockchainClientProvider.getBlockchainClient({
      chainInfo: params.chainInfo,
    })
    const balance = await client.getBalance({ address: token.address.value })

    return TokenAmount.createFromBaseUnit({
      token,
      amount: balance.toString(),
    })
  }

  /** PRIVATE METHODS */

  /**
   * @method _addTokenData
   * @description Adds a token data to the internal map indexed by the Chain ID
   * @param tokenData The token data to add
   */
  private _addTokenData(params: { tokenData: TokenData }) {
    const { tokenData } = params

    if (!this._tokenByChainID.has(tokenData.chainId)) {
      this._tokenByChainID.set(tokenData.chainId, new TokensMap({ chainID: tokenData.chainId }))
    }

    const tokensMap = this._tokenByChainID.get(tokenData.chainId)
    assert(tokensMap !== undefined, 'TokensMap should have been initialized')

    tokensMap.add({ tokenData })
  }

  /**
   * @method _getTokenMap
   * @description Retrieves the token map for a given chain ID
   * @param chainInfo The chain information from which to extract the Chain ID
   * @returns The token map for the given chain ID or undefined if it does not exist
   */
  private _getTokenMap(chainInfo: IChainInfo): Maybe<TokensMap> {
    return this._tokenByChainID.get(chainInfo.chainId)
  }

  /**
   * @method _createToken
   * @description Creates a Token instance from the given TokenData
   * @param chainInfo The chain information to create the Token from
   * @param tokenData The token data to create the Token from
   * @returns The created Token instance
   */
  private _createToken(params: { chainInfo: IChainInfo; tokenData: TokenData }): IToken {
    const { chainInfo, tokenData } = params

    return Token.createFrom({
      address: Address.createFrom({ value: tokenData.address, type: AddressType.Ethereum }),
      chainInfo: chainInfo,
      decimals: tokenData.decimals,
      name: tokenData.name,
      symbol: tokenData.symbol,
    })
  }
}
