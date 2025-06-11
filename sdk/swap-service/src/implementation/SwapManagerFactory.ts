import { type IConfigurationProvider } from '@summerfi/configuration-provider-common'
import { SwapManager } from './SwapManager'
import { OneInchSwapProvider } from './oneinch/OneInchSwapProvider'
import { CowSwapProvider } from './cowswap/CowSwapProvider'

/**
 * @class SwapManagerFactory
 * @description Factory class to create a new SwapManager instance including all supported providers
 */
export class SwapManagerFactory {
  public static newSwapManager(params: { configProvider: IConfigurationProvider }): SwapManager {
    return new SwapManager({
      providers: [new OneInchSwapProvider(params), new CowSwapProvider(params)],
    })
  }
}
