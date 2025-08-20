import { Address, type ChainId } from '@summerfi/sdk-common'
import type {
  DeploymentProviderDeployedContracts,
  DeploymentProviderConfig,
} from './DeploymentProviderConfig'
import type { IDeploymentProvider } from './IDeploymentProvider'

export const getDeployedContractAddress = (params: {
  config: DeploymentProviderConfig
  contractName: keyof DeploymentProviderDeployedContracts
  chainId: ChainId
}): Address => {
  const address = params.config.deployedContracts[params.contractName][params.chainId]
  if (!address) {
    throw new Error(`Contract ${params.contractName} not deployed on chain ${params.chainId}`)
  }
  return Address.createFromEthereum({
    value: address,
  })
}

export const DeploymentProvider = (config: DeploymentProviderConfig) => {
  return {
    getDeployedContractAddress: (
      params: Parameters<IDeploymentProvider['getDeployedContractAddress']>[0],
    ) => {
      return getDeployedContractAddress({
        config,
        contractName: params.contractName,
        chainId: params.chainId,
      })
    },
  }
}
