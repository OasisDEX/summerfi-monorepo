import { IConfigurationProvider } from '@summerfi/configuration-provider'
import { ContractsProvider } from './ContractsProvider'

/**
 * @name ContractsProviderFactory
 * @description This class is responsible for creating instances of the ContractsProvider
 */
export class ContractsProviderFactory {
  public static newContractsProvider(params: { configProvider: IConfigurationProvider }): ContractsProvider {
    return new ContractsProvider(params)
  }
}
