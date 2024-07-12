import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { AbiProvider } from './AbiProvider'

/**
 * @name AbiProviderFactory
 * @description This class is responsible for creating instances of the AbiProvider
 */
export class AbiProviderFactory {
  public static newAbiProvider(params: { configProvider: IConfigurationProvider }): AbiProvider {
    return new AbiProvider(params)
  }
}
