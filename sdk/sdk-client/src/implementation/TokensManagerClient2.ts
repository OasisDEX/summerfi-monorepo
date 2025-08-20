import { Address, getChainInfoByChainId } from '@summerfi/sdk-common'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'
import { ITokensManagerClient2 } from '../interfaces/ITokensManagerClient2'

/**
 * @name TokensManagerClient2
 * @description Implementation of the ITokensManagerClient2 interface for the SDK Client
 */
export class TokensManagerClient2 extends IRPCClient implements ITokensManagerClient2 {
  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see ITokensManagerClient2.getTokenBySymbol */
  public async getTokenBySymbol(
    params: Parameters<ITokensManagerClient2['getTokenBySymbol']>[0],
  ): ReturnType<ITokensManagerClient2['getTokenBySymbol']> {
    return this.rpcClient.tokens.getTokenBySymbol.query({
      chainInfo: getChainInfoByChainId(params.chainId),
      symbol: params.symbol,
    })
  }

  /** @see ITokensManagerClient2.getTokenByAddress */
  public async getTokenByAddress(
    params: Parameters<ITokensManagerClient2['getTokenByAddress']>[0],
  ): ReturnType<ITokensManagerClient2['getTokenByAddress']> {
    return this.rpcClient.tokens.getTokenByAddress.query({
      chainInfo: getChainInfoByChainId(params.chainId),
      address: Address.createFromEthereum({
        value: params.addressValue,
      }),
    })
  }
}
