import type { Address, ChainId } from '@summerfi/sdk-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'

export interface IDeploymentProvider {
  getDeployedContractAddress: (params: {
    contractName: keyof DeploymentProviderConfig['contracts']
    chainId: ChainId
  }) => Address
}
