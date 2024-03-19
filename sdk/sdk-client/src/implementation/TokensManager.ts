import { Address, ChainInfo, Maybe, Token, TokenSymbol } from '@summerfi/sdk-common/common'
import { ITokensManager } from '../interfaces/ITokensManager'
import { getMockTokenBySymbol } from '../mocks/mockToken'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCClientType } from '../rpc/SDKClient'

export class TokensManager extends IRPCClient implements ITokensManager {
  private readonly _chainInfo: ChainInfo

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public constructor(params: { rpcClient: RPCClientType; chainInfo: ChainInfo }) {
    super(params)
    // TODO: load the list of tokens for the chain indicated by chainInfo
    this._chainInfo = params.chainInfo
  }

  public async getSupportedTokens(): Promise<Token[]> {
    // TODO: Implement
    return [] as Token[]
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenBySymbol(params: { symbol: TokenSymbol }): Promise<Maybe<Token>> {
    // TODO: Implement
    return getMockTokenBySymbol({ chainInfo: this._chainInfo, symbol: params.symbol })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByAddress(_params: { address: Address }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getTokenByName(_params: { name: string }): Promise<Maybe<Token>> {
    // TODO: Implement
    return undefined
  }
}
