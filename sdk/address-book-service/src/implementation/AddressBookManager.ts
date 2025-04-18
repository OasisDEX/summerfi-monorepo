import type { Maybe, IAddress, IChainInfo } from '@summerfi/sdk-common'
import { IAddressBookManager } from '@summerfi/address-book-common'
import { DeploymentIndex } from '@summerfi/deployment-utils'
import { Address, AddressValue } from '@summerfi/sdk-common'

/**
 * @name AddressBookManager
 * @see IAddressBookManager
 */
export class AddressBookManager implements IAddressBookManager {
  readonly deployments: DeploymentIndex
  readonly deploymentsTag: string

  /** CONSTRUCTOR */
  constructor(params: { deployments: DeploymentIndex; deploymentTag: string }) {
    this.deployments = params.deployments
    this.deploymentsTag = params.deploymentTag
  }

  /** PUBLIC METHODS */

  /** @see IAddressBookManager.getAddressByName */
  async getAddressByName(params: {
    chainInfo: IChainInfo
    name: string
  }): Promise<Maybe<IAddress>> {
    const deploymentKey = this._getDeploymentKey(params.chainInfo)

    const deployment = this.deployments[deploymentKey]

    const contractInfo = deployment.contracts[params.name] || deployment.dependencies[params.name]
    if (!contractInfo) {
      return undefined
    }

    return Address.createFromEthereum({
      value: contractInfo.address as AddressValue,
    })
  }

  /** PRIVATE */

  /**
   * Generates the deployment key for the given chain
   * @param chainInfo Chain used to generate the tag
   * @returns The deployment key
   */
  private _getDeploymentKey(chainInfo: IChainInfo): string {
    return `${chainInfo.name}.${this.deploymentsTag}`
  }
}
