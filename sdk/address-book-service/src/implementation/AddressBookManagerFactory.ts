import { type IConfigurationProvider } from '@summerfi/configuration-provider'
import { AddressBookManager } from './AddressBookManager'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { Deployments } from '@summerfi/core-contracts'
import { DeploymentIndex } from '@summerfi/deployment-utils'

/**
 * @name AddressBookManagerFactory
 * @description Factory class for the AddressBookManager. Takes care of generating the manager config and creates an instance
 */
export class AddressBookManagerFactory {
  /**
   * @method newAddressBookManager
   * @param configProvider The configuration provider used to get environment variables
   * @returns A new instance of the AddressBookManager
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public static newAddressBookManager(params: {
    configProvider: IConfigurationProvider
  }): IAddressBookManager {
    return new AddressBookManager({
      deployments: Deployments as DeploymentIndex,
      deploymentTag: 'standard',
    })
  }
}
