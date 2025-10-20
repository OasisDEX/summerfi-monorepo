import { Address, type ChainId } from '@summerfi/sdk-common'
import type { DeploymentProviderConfig } from './DeploymentProviderConfig'
import type { IDeploymentProvider } from './IDeploymentProvider'

export const getDeployedContractAddress = (params: {
  config: DeploymentProviderConfig
  contractName: keyof DeploymentProviderConfig['contracts']
  chainId: ChainId
}): Address => {
  const address = params.config.contracts[params.contractName][params.chainId]
  if (!address) {
    throw new Error(`Contract ${params.contractName} not deployed on chain ${params.chainId}`)
  }
  return Address.createFromEthereum({
    value: address,
  })
}

export const DeploymentProvider = (configs: DeploymentProviderConfig[]) => {
  return {
    getDeployedContractAddress: (params) => {
      const config = configs.find((c) => c.chainId === params.chainId)
      if (!config) {
        throw new Error(`No deployment config found for chainId ${params.chainId}`)
      }
      return getDeployedContractAddress({
        config,
        contractName: params.contractName,
        chainId: params.chainId,
      })
    },
  } as IDeploymentProvider
}
