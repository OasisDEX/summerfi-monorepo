import { Address, ChainInfo, IToken, Maybe, TokenSymbol } from '@summerfi/sdk-common'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ITokensManagerClient } from '../interfaces/ITokensManagerClient'

/**
 * @name TokensManagerClient
 * @description Implementation of the ITokensManager interface for the SDK Client
 */
export class TokensManagerClient extends IRPCClient implements ITokensManagerClient {
  private readonly _chainInfo: ChainInfo

  public constructor(params: { rpcClient: RPCMainClientType; chainInfo: ChainInfo }) {
    super(params)

    this._chainInfo = params.chainInfo
  }

  /** @see ITokensManagerClient.getTokenBySymbol */
  public async getTokenBySymbol(params: { symbol: TokenSymbol }): Promise<IToken> {
    return this.rpcClient.tokens.getTokenBySymbol.query({
      chainInfo: this._chainInfo,
      symbol: params.symbol,
    })
  }

  /** @see ITokensManagerClient.getTokenByAddress */
  public async getTokenByAddress(params: { address: Address }): Promise<IToken> {
    return this.rpcClient.tokens.getTokenByAddress.query({
      chainInfo: this._chainInfo,
      address: params.address,
    })
  }

  /** @see ITokensManagerClient.getTokenByName */
  public async getTokenByName(_params: { name: string }): Promise<IToken> {
    return this.rpcClient.tokens.getTokenByName.query({
      chainInfo: this._chainInfo,
      name: _params.name,
    })
  }
}
