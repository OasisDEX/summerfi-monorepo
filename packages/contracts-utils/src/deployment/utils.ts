import { DeploymentFileExtension, DeploymentTypeSeparator } from './constants'
import {
  ProviderTypes,
  DeploymentType,
  isProvider,
  isNetwork,
  Provider,
  Network,
  ConfigName,
  DeploymentParams,
} from './types'
import { WalletClient } from './viem-types'

export function getDeploymentNameFromType(type: DeploymentType): string {
  return `${type.provider}${DeploymentTypeSeparator}${type.network}${DeploymentTypeSeparator}${type.config}`
}

export function getLegacyDeploymentNameFromType(type: DeploymentType): string {
  let deploymentName = ''

  if (type.provider === ProviderTypes.Remote) {
    deploymentName = type.network + DeploymentTypeSeparator + type.config
  } else if (type.provider === ProviderTypes.Internal) {
    deploymentName = 'hardhat'
  } else {
    deploymentName = 'localhost' + DeploymentTypeSeparator + type.config
  }
  return deploymentName
}

export function getDeploymentsName(
  type: DeploymentType,
  timestamp: number | undefined = undefined,
): string {
  let deploymentsFileName = getDeploymentNameFromType(type)
  const deploymentExtension = DeploymentFileExtension

  if (timestamp) {
    deploymentsFileName += `${DeploymentTypeSeparator}` + String(timestamp)
  }

  return deploymentsFileName + deploymentExtension
}

export function getDeploymentTypeFromName(name: string): DeploymentType {
  const [provider, network, config] = name.split(DeploymentTypeSeparator)

  if (!isProvider(provider)) {
    throw new Error(`Invalid provider in deployment type: ${provider}`)
  }
  if (!isNetwork(network)) {
    throw new Error(`Invalid network in deployment type: ${network}`)
  }

  return {
    provider: provider as Provider,
    network: network as Network,
    config: config as ConfigName,
  }
}

export function isDeploymentParams(options: unknown): options is DeploymentParams {
  return (
    typeof options === 'object' && options !== null && 'options' in options && 'type' in options
  )
}

export function isWalletClient(client: unknown): client is WalletClient {
  return (
    typeof client === 'object' &&
    client !== null &&
    'account' in client &&
    'chain' in client &&
    'name' in client
  )
}
