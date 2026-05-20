import type { Address, ChainId } from '@summerfi/sdk-common'
import type { DeploymentProviderConfigPublic } from './DeploymentProviderConfig'

export interface IDeploymentProvider {
  getDeployedContractAddress: (params: {
    contractName: keyof DeploymentProviderConfigPublic['contracts']
    chainId: ChainId
  }) => Address
}
