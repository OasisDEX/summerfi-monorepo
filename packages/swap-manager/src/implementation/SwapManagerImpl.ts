import { ChainInfo } from '@summerfi/sdk/chains'
import { Address, Percentage, TokenAmount } from '@summerfi/sdk/common'
import { SwapManager } from '~swap-manager'
import { SwapData } from '~swap-manager/interfaces/SwapManager'
import { OneInchSwapManager } from './oneinch/OneInchSwapManager'

export class SwapManagerImpl implements SwapManager {
  private readonly _oneInchSwapManager: OneInchSwapManager

  constructor() {
    this._oneInchSwapManager = new OneInchSwapManager()
  }

  public async getSwapData(params: {
    chainInfo: ChainInfo
    fromAmount: TokenAmount
    toMinimumAmount: TokenAmount
    recipient: Address
    slippage: Percentage
  }): Promise<SwapData> {
    // Only one swap provider is implemented for now. The idea is to have multiple swap providers
    // and choose the best one based on the input parameters or on the swap provider's capabilities.
    return this._oneInchSwapManager.getSwapData(params)
  }
}
