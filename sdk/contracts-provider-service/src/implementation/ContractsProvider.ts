import {
  IContractsProvider,
} from '@summerfi/contracts-provider-common'
import { IConfigurationProvider } from '@summerfi/configuration-provider'

/**
 * @name ContractsProvider
 * @implements IContractsProvider
 */
export class ContractsProvider implements IContractsProvider {
  private _configProvider: IConfigurationProvider

  /** CONSTRUCTOR */
  constructor(params: { configProvider: IConfigurationProvider }) {
    this._configProvider = params.configProvider
  }

  // TODO: add here the methods that the service will implement
}
