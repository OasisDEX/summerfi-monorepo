import type { DeploymentType } from './types'
import { getDeploymentTypeFromName, isProvider, isNetwork } from './utils'

export function parseDeploymentName(deploymentName: string): DeploymentType {
  const [provider, network, config] = deploymentName.split('.')

  if (!isProvider(provider)) {
    throw new Error(`Invalid provider in deployment type: ${provider}`)
  }
  if (!isNetwork(network)) {
    throw new Error(`Invalid network in deployment type: ${network}`)
  }

  return {
    provider,
    network,
    config,
  }
}

export function getDeploymentType(): DeploymentType {
  const deploymentName = process.env.CONTRACTS_DEPLOYMENT_TYPE

  if (!deploymentName) {
    throw new Error('DEPLOYMENT_TYPE environment variable is not set')
  }

  return getDeploymentTypeFromName(deploymentName)
}
