import type { Percentage, QuoteData, Token, TokenAmount } from '@summerfi/sdk-common'
import { IRPCClient } from '../interfaces/IRPCClient'
import type { ISwapManagerClient } from '../interfaces/ISwapManagerClient'
import type { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * @name SwapManagerClient
 * @description Implementation of the ISwapManagerClient interface for the SDK Client
 */
export class SwapManagerClient extends IRPCClient implements ISwapManagerClient {
  public constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /** @see ISwapManagerClient.getSwapQuoteExactInput */
  public async getSwapQuoteExactInput(params: {
    fromAmount: TokenAmount
    toToken: Token
    slippage: Percentage
  }): Promise<QuoteData> {
    return this.rpcClient.swaps.getSwapQuoteExactInput.query({
      fromAmount: params.fromAmount,
      toToken: params.toToken,
      slippage: params.slippage,
    })
  }
}
