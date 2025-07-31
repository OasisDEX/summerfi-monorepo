import type { Address, ChainId } from '@summerfi/sdk-common'
import type { DeploymentProviderDeployedContracts } from './DeploymentProviderConfig'

export interface IDeploymentProvider {
  getDeployedContractAddress: (params: {
    contractName: keyof DeploymentProviderDeployedContracts
    chainId: ChainId
  }) => Address
}
