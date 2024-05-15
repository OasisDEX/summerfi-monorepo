import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { OneInchSwapProvider } from './oneinch/OneInchSwapProvider'
import { SwapManager } from './SwapManager'

/**
 * @class SwapManagerFactory
 * @description Factory class to create a new SwapManager instance including all supported providers
 */
export class SwapManagerFactory {
  public static newSwapManager(params: { configProvider: IConfigurationProvider }): SwapManager {
    return new SwapManager({
      providers: [new OneInchSwapProvider(params)],
    })
  }
}
