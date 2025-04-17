import { AddressValue, Maybe, ChainId } from '@summerfi/sdk-common'
import { TokenData } from './TokensData'

/**
 * @name TokensMap
 * @description A map of tokens for a given chain ID
 */
export class TokensMap {
  readonly chainId: ChainId

  private _tokensBySymbol: Map<string, TokenData>
  private _tokensByAddress: Map<string, TokenData>
  private _tokensByName: Map<string, TokenData>

  constructor(params: { chainID: ChainId }) {
    this.chainId = params.chainID

    this._tokensBySymbol = new Map()
    this._tokensByAddress = new Map()
    this._tokensByName = new Map()
  }

  /**
   * @method add
   * @description Adds a token to the map and indexes it by the different criteria
   * @param tokenData The token data to add
   */
  add(params: { tokenData: TokenData }) {
    if (this._tokensBySymbol.has(params.tokenData.symbol.toLowerCase())) {
      throw new Error(
        `Token with symbol ${params.tokenData.symbol} already exists for chain ID ${this.chainId}`,
      )
    }

    if (this._tokensByAddress.has(params.tokenData.address.toLowerCase())) {
      throw new Error(
        `Token with address ${params.tokenData.address} already exists for chain ID ${this.chainId}`,
      )
    }

    if (this._tokensByName.has(params.tokenData.name.toLowerCase())) {
      throw new Error(
        `Token with name ${params.tokenData.name} already exists for chain ID ${this.chainId}`,
      )
    }

    this._tokensBySymbol.set(params.tokenData.symbol.toLowerCase(), params.tokenData)
    this._tokensByAddress.set(params.tokenData.address.toLowerCase(), params.tokenData)
    this._tokensByName.set(params.tokenData.name.toLowerCase(), params.tokenData)
  }

  /**
   * @method getBySymbol
   * @param symbol The symbol of the token to retrieve
   * @returns The token data for the given symbol or undefined if it does not exist
   */
  getBySymbol(symbol: string): Maybe<TokenData> {
    return this._tokensBySymbol.get(symbol.toLowerCase())
  }

  /**
   * @method getByAddress
   * @description Retrieves a token by its address
   * @param address The address of the token to retrieve
   * @returns The token data for the given address or undefined if it does not exist
   */
  getByAddress(address: AddressValue): Maybe<TokenData> {
    return this._tokensByAddress.get(address.toLowerCase())
  }

  /**
   * @method getByName
   * @description Retrieves a token by its name
   * @param name The full name of the token to retrieve
   * @returns The token data for the given name or undefined if it does not exist
   */
  getByName(name: string): Maybe<TokenData> {
    return this._tokensByName.get(name.toLowerCase())
  }
}
